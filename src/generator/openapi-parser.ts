/**
 * OpenAPI 解析器 - 将 OpenAPI 规范解析为可用于代码生成的数据结构
 */

import { ParsingStrategyManager } from './parsing-strategies';
import { OpenAPIV3 } from 'openapi-types';
import { pascalCase, camelCase } from 'change-case';

// 使用标准的 OpenAPI 类型定义
export type OpenAPISpec = OpenAPIV3.Document;
export type SchemaObject = OpenAPIV3.SchemaObject;
export type OperationSpec = OpenAPIV3.OperationObject;
export type RequestBodyObject = OpenAPIV3.RequestBodyObject;
export type ResponseObject = OpenAPIV3.ResponseObject;
export type ParameterObject = OpenAPIV3.ParameterObject;

export interface ParsedAPI {
  className: string;
  operations: ParsedOperation[];
  types: ParsedType[];
}

export interface ParsedOperation {
  name: string;
  method: string;
  path: string;
  summary?: string;
  description?: string;
  requestType?: string;
  responseType?: string;
  parameters?: ParsedParameter[];
}

export interface ParsedParameter {
  name: string;
  type: string;
  required: boolean;
  in: 'query' | 'path' | 'header' | 'body' | 'cookie';
}

export interface ParsedType {
  name: string;
  description?: string;
  properties: Record<string, TypeProperty>;
}

export interface TypeProperty {
  type: string;
  required: boolean;
  description?: string;
  // OpenAPI validation properties
  format?: string;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
}

export class OpenAPIParser {
  private strategyManager: ParsingStrategyManager;

  constructor() {
    this.strategyManager = new ParsingStrategyManager();
  }

  parse(spec: OpenAPISpec): ParsedAPI[] {
    const apis: ParsedAPI[] = [];
    const allTypes: Map<string, ParsedType> = new Map();

    // 解析 schemas 生成类型 - 使用策略模式
    if (spec.components?.schemas) {
      for (const [name, schema] of Object.entries(spec.components.schemas)) {
        const parsedType = this.strategyManager.parseByStrategy('schema-parsing', { name, schema }) as ParsedType;
        allTypes.set(parsedType.name, parsedType);
      }
    }

    // 按 tag 分组 API
    const tagGroups = this.groupByTags(spec.paths);

    for (const [tag, operations] of Object.entries(tagGroups)) {
      const className = this.toClassName(tag);
      const parsedOperations: ParsedOperation[] = [];

      for (const op of operations) {
        // 使用策略模式解析操作
        const parsedOp = this.strategyManager.parseByStrategy('operation-parsing', op) as ParsedOperation;
        parsedOperations.push(parsedOp);
        
        // 生成请求/响应类型（去重） - 使用策略模式
        if (op.requestBody) {
          const typeName = `${this.simplifyOperationName(op.operationId)}Request`;
          const requestType = this.strategyManager.parseByStrategy('request-type-parsing', { operation: op, typeName }) as ParsedType;
          allTypes.set(requestType.name, requestType);
        }
        if (op.responses) {
          const typeName = `${this.simplifyOperationName(op.operationId)}Response`;
          const responseType = this.strategyManager.parseByStrategy('response-type-parsing', { operation: op, typeName }) as ParsedType;
          allTypes.set(responseType.name, responseType);
        }
      }

      apis.push({
        className,
        operations: parsedOperations,
        types: Array.from(allTypes.values())
      });
    }

    return apis;
  }


  private groupByTags(paths: OpenAPIV3.PathsObject) {
    const groups: Record<string, OperationWithPath[]> = {};
    const errors: string[] = [];
    
    for (const [path, pathItem] of Object.entries(paths)) {
      if (!pathItem) continue;
      
      // 从 PathItemObject 中提取所有 HTTP 方法
      const httpMethods: Array<{ method: string; operation: OpenAPIV3.OperationObject }> = [];
      
      if (pathItem.get) httpMethods.push({ method: 'get', operation: pathItem.get });
      if (pathItem.post) httpMethods.push({ method: 'post', operation: pathItem.post });
      if (pathItem.put) httpMethods.push({ method: 'put', operation: pathItem.put });
      if (pathItem.delete) httpMethods.push({ method: 'delete', operation: pathItem.delete });
      if (pathItem.options) httpMethods.push({ method: 'options', operation: pathItem.options });
      if (pathItem.head) httpMethods.push({ method: 'head', operation: pathItem.head });
      if (pathItem.patch) httpMethods.push({ method: 'patch', operation: pathItem.patch });
      if (pathItem.trace) httpMethods.push({ method: 'trace', operation: pathItem.trace });
      
      for (const { method, operation } of httpMethods) {
        // 严格按照 operationId 格式要求进行分组
        let tag: string;
        
        // 验证 operationId 存在且格式正确
        if (!operation.operationId) {
          const pathSegments = path.split('/').filter(Boolean);
          const controllerName = pathSegments[1] || 'api'; // api/users -> users
          const methodName = this.extractMethodFromPath(path, method);
          const suggestedId = `${controllerName}Controller_${methodName}`;
          const routePath = path.replace(`/api/${controllerName}`, '') || '/';
          errors.push(
            `❌ ${method.toUpperCase()} ${path}: operationId 缺失\n` +
            `   💡 建议在Controller中添加：@ApiOperation({ operationId: '${suggestedId}' })\n` +
            `   📝 或者：@${method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()}('${routePath}', { operationId: '${suggestedId}' })`
          );
          continue;
        }
        
        const match = operation.operationId.match(/^([a-zA-Z]+?)(?:controller)?[_]([a-zA-Z]+)/i);
        if (!match) {
          const pathSegments = path.split('/').filter(Boolean);
          const controllerName = pathSegments[1] || 'your'; // api/users -> users
          const methodName = this.extractMethodFromPath(path, method);
          const suggestedId = `${controllerName}Controller_${methodName}`;
          
          errors.push(
            `❌ ${method.toUpperCase()} ${path}: operationId "${operation.operationId}" 格式不正确\n` +
            `   💡 期望格式: "controllerName_methodName" 或 "controllerNameController_methodName"\n` +
            `   📝 建议修改为: "${suggestedId}"\n` +
            `   🔧 在Controller中修改：@ApiOperation({ operationId: '${suggestedId}' })`
          );
          continue;
        }
        
        // 转换为驼峰命名，去掉Controller后缀
        const controllerName = match[1].replace(/controller$/i, ''); // 去掉controller后缀
        tag = this.toPascalCase(controllerName);
        
        // 调试信息：显示分组结果
        if (process.env.DEBUG) {
          console.log(`📊 ${method.toUpperCase()} ${path} → ${tag} (operationId: ${operation.operationId})`);
        }
        
        if (!groups[tag]) {
          groups[tag] = [];
        }
        groups[tag].push({ path, method, ...operation });
      }
    }
    
    // 如果有错误，输出所有错误信息并抛出异常
    if (errors.length > 0) {
      console.error('\n🚨 发现以下 operationId 格式错误:');
      console.error('='.repeat(60));
      errors.forEach((error, index) => {
        console.error(`\n${index + 1}. ${error}`);
      });
      console.error('\n📖 operationId 命名规范说明:');
      console.error('   格式: {controllerName}Controller_{methodName} 或 {controllerName}_{methodName}');
      console.error('   示例: userController_getUsers, orderController_createOrder');
      console.error('   注意: 使用驼峰命名，controllerName应与文件名对应');
      console.error('='.repeat(60));
      throw new Error(`发现 ${errors.length} 个 operationId 格式错误，请修复后重新生成`);
    }
    
    return groups;
  }
  
  /**
   * 从路径和HTTP方法推断方法名（通用规则）
   */
  private extractMethodFromPath(path: string, method: string): string {
    const httpMethod = method.toLowerCase();
    
    // 解析路径，提取最后的资源名称
    const pathSegments = path.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // 如果最后一段是参数（包含{}），则取倒数第二段
    const resourceName = lastSegment?.includes('{') 
      ? pathSegments[pathSegments.length - 2] 
      : lastSegment;
    
    // 基于HTTP方法和路径结构生成方法名
    let methodName = '';
    
    switch (httpMethod) {
      case 'get':
        if (path.includes('/{')) {
          // GET /users/{id} -> getById
          methodName = 'getById';
        } else if (resourceName && resourceName !== pathSegments[1]) {
          // GET /users/active -> getActive  
          // GET /orders/stats -> getStats
          methodName = 'get' + this.toPascalCase(resourceName);
        } else {
          // GET /users -> getList
          methodName = 'getList';
        }
        break;
      case 'post':
        methodName = 'create';
        break;
      case 'put':
        if (resourceName && resourceName !== pathSegments[1]) {
          // PUT /users/{id}/status -> updateStatus
          methodName = 'update' + this.toPascalCase(resourceName);
        } else {
          // PUT /users/{id} -> update
          methodName = 'update';
        }
        break;
      case 'patch':
        methodName = 'patch';
        break;
      case 'delete':
        methodName = 'delete';
        break;
      default:
        methodName = httpMethod;
    }
    
    return methodName;
  }
  
  /**
   * 转换为PascalCase命名 - 直接使用change-case库
   */
  private toPascalCase(str: string): string {
    return pascalCase(str);
  }

  private parseOperation(op: OperationWithPath): ParsedOperation {
    return {
      name: op.operationId || this.generateOperationName(op.path, op.method),
      method: op.method.toUpperCase(),
      path: op.path,
      summary: op.summary,
      description: op.description,
      requestType: op.requestBody ? `${this.simplifyOperationName(op.operationId)}Request` : undefined,
      responseType: op.responses['200'] ? `${this.simplifyOperationName(op.operationId)}Response` : undefined,
      parameters: op.parameters
        ?.filter((p): p is ParameterObject => 'name' in p && 'in' in p)
        .map((p) => ({
          name: p.name,
          type: (p.schema && 'type' in p.schema) ? p.schema.type || 'string' : 'string',
          required: p.required || false,
          in: (p.in === 'cookie' ? 'header' : p.in) as 'query' | 'path' | 'header' | 'body' | 'cookie'
        })) || []
    };
  }

  private parseSchema(name: string, schema: SchemaObject): ParsedType {
    const properties: Record<string, TypeProperty> = {};
    
    if (schema.properties) {
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        // Type assertion for OpenAPI schema properties
        const prop = propSchema as any;
        
        properties[propName] = {
          type: prop.type || 'any', // 保持原始类型，不进行转换
          required: schema.required?.includes(propName) || false,
          description: prop.description,
          // Extract OpenAPI validation properties
          format: prop.format as string,
          pattern: prop.pattern as string,
          minimum: prop.minimum as number,
          maximum: prop.maximum as number,
          exclusiveMinimum: prop.exclusiveMinimum as number,
          exclusiveMaximum: prop.exclusiveMaximum as number,
          minLength: prop.minLength as number,
          maxLength: prop.maxLength as number,
          minItems: prop.minItems as number,
          maxItems: prop.maxItems as number,
          uniqueItems: prop.uniqueItems as boolean
        };
      }
    }

    return { 
      name: this.toClassName(name), 
      description: schema.description,
      properties 
    };
  }

  private parseRequestType(op: OperationWithPath): ParsedType {
    // 解析请求体类型
    const requestBody = op.requestBody;
    if (!requestBody || '$ref' in requestBody) {
      return this.generateDefaultRequestType(op, op.operationId + 'Request');
    }
    
    let schema = requestBody.content?.['application/json']?.schema;
    const typeName = `${this.simplifyOperationName(op.operationId)}Request`;
    
    if (schema) {
      // 处理 $ref 引用
      if ('$ref' in schema) {
        const refName = this.extractRefName(schema.$ref);
        return { name: this.toClassName(refName), description: undefined, properties: {} };
      }
      
      const parsedType = this.parseSchema(typeName, schema as SchemaObject);
      
      // 如果 schema 只是空的 object，尝试推断一些通用字段
      if (Object.keys(parsedType.properties).length === 0 && (schema as SchemaObject).type === 'object') {
        return this.generateDefaultRequestType(op, typeName);
      }
      
      return parsedType;
    }
    
    return this.generateDefaultRequestType(op, typeName);
  }

  /**
   * 从$ref路径中提取schema名称
   */
  private extractRefName(ref: string): string {
    // 从 "#/components/schemas/CreateUserRequest" 中提取 "CreateUserRequest"
    const parts = ref.split('/');
    return parts[parts.length - 1];
  }

  private parseResponseType(op: OperationWithPath): ParsedType {
    // 解析响应类型
    const response200 = op.responses['200'];
    if (!response200 || '$ref' in response200) {
      return this.generateDefaultResponseType(op, op.operationId + 'Response');
    }
    
    let schema = response200.content?.['application/json']?.schema;
    const typeName = `${this.simplifyOperationName(op.operationId)}Response`;
    
    if (schema) {
      // 处理 $ref 引用
      if ('$ref' in schema) {
        const refName = this.extractRefName(schema.$ref);
        return { name: this.toClassName(refName), description: undefined, properties: {} };
      }
      
      const parsedType = this.parseSchema(typeName, schema as SchemaObject);
      
      // 如果 schema 只是空的 object，生成默认的响应类型
      if (Object.keys(parsedType.properties).length === 0 && (schema as SchemaObject).type === 'object') {
        return this.generateDefaultResponseType(op, typeName);
      }
      
      return parsedType;
    }
    
    return this.generateDefaultResponseType(op, typeName);
  }

  /**
   * 简化操作名，移除冗余的 Controller 前缀并转换为正确的驼峰格式
   */
  private simplifyOperationName(operationId?: string): string {
    if (!operationId) return 'Unknown';
    
    // 移除 Controller 前缀，只保留操作名
    let simplified = operationId
      .replace(/^.*Controller_?/i, '') // 移除 XxxController_ 前缀
      .replace(/^.*controller_?/i, '') // 移除 xxxcontroller_ 前缀
      .replace(/^.*Api_?/i, '')        // 移除 XxxApi_ 前缀
      .replace(/^.*api_?/i, '');       // 移除 xxxapi_ 前缀
    
    // 转换为正确的驼峰格式
    return this.toPascalCase(simplified);
  }

  private generateDefaultRequestType(op: OperationWithPath, typeName: string): ParsedType {
    // 根据操作生成默认的请求类型
    const properties: Record<string, TypeProperty> = {};
    
    // 从路径中提取可能的参数
    const pathParams = op.path?.match(/\{([^}]+)\}/g)?.map((param: string) => param.slice(1, -1)) || [];
    
    pathParams.forEach((param: string) => {
      properties[param] = {
        type: 'string',
        required: true,
        description: `路径参数: ${param}`
      };
    });
    
    // 根据操作名称推断常见参数
    const operationName = op.operationId?.toLowerCase() || '';
    
    if (operationName.includes('query') || operationName.includes('search')) {
      if (!properties['pageSize']) {
        properties['pageSize'] = { type: 'number', required: true, description: '页面大小' };
      }
      if (!properties['pageNum']) {
        properties['pageNum'] = { type: 'number', required: true, description: '页码' };
      }
    }
    
    if (operationName.includes('token') || operationName.includes('ca')) {
      if (!properties['caAddress']) {
        properties['caAddress'] = { type: 'string', required: false, description: '代币合约地址' };
      }
    }
    
    if (operationName.includes('wallet') || operationName.includes('address')) {
      if (!properties['walletAddress']) {
        properties['walletAddress'] = { type: 'string', required: false, description: '钱包地址' };
      }
    }
    
    if (operationName.includes('user') || operationName.includes('uid')) {
      if (!properties['userId']) {
        properties['userId'] = { type: 'string', required: false, description: '用户ID' };
      }
    }
    
    // 如果仍然没有属性，添加一个通用的 data 字段
    if (Object.keys(properties).length === 0) {
      properties['data'] = {
        type: 'Record<string, any>',  // 使用 any 确保类型明确
        required: true,                    // ✅ 设为必填
        description: '请求数据'
      };
    }
    
    return { name: typeName, properties };
  }

  private generateDefaultResponseType(op: OperationWithPath, typeName: string): ParsedType {
    // 生成默认的响应类型结构
    const properties: Record<string, TypeProperty> = {
      code: {
        type: 'number',
        required: true,  // ✅ 改为必填
        description: '响应状态码'
      },
      message: {
        type: 'string',
        required: true,  // ✅ 改为必填
        description: '响应消息'
      },
      data: {
        type: 'unknown',  // ✅ 使用 unknown 替代 any
        required: false,
        description: '响应数据'
      },
      success: {
        type: 'boolean',
        required: true,  // ✅ 改为必填
        description: '请求是否成功'
      }
    };
    
    return { name: typeName, properties };
  }

  private toClassName(str: string): string {
    return str.replace(/^./, char => char.toUpperCase())
              .replace(/[^a-zA-Z0-9]/g, '');
  }

  private generateOperationName(path: string, method: string): string {
    const segments = path.split('/').filter(s => s && !s.startsWith('{'));
    return method.toLowerCase() + segments.map(s => this.toClassName(s)).join('');
  }

// mapType方法已移除 - 策略模式不需要类型转换，直接保持原始TypeScript类型
}

// 辅助类型
interface OperationWithPath extends OperationSpec {
  path: string;
  method: string;
}