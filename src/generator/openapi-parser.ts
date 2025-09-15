/**
 * OpenAPI 解析器 - 将 OpenAPI 规范解析为可用于代码生成的数据结构
 */

import { OpenAPIV3 } from 'openapi-types';
import { pascalCase } from 'change-case';

// 使用标准的 OpenAPI 类型定义
export type OpenAPISpec = OpenAPIV3.Document;
export type SchemaObject = OpenAPIV3.SchemaObject;
export type OperationSpec = OpenAPIV3.OperationObject;

export interface APIGroup {
  className: string;
  operations: APIOperation[];
  types: TypeDefinition[];
}

export interface APIOperation {
  name: string;
  method: string;
  path: string;
  summary?: string;
  description?: string;
  requestType?: string;
  responseType?: string;
  parameters?: Parameter[];
}

export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  in: 'query' | 'path' | 'header' | 'body' | 'cookie';
}

export interface TypeDefinition {
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

/**
 * 路径结构分析结果接口
 */
interface PathAnalysis {
  paramCount: number;
  versionPrefix: string | null;
}

export class OpenAPIParser {
  constructor() {
  }

  parse(spec: OpenAPISpec): APIGroup[] {
    const apis: APIGroup[] = [];
    const allTypes: Map<string, TypeDefinition> = new Map();

    // 解析 schemas 生成类型 - 使用策略模式
    if (spec.components?.schemas) {
      for (const [name, schema] of Object.entries(spec.components.schemas)) {
        if (this.isSchemaObject(schema)) {
          const parsedType = this.parseSchema(name, schema);
          allTypes.set(parsedType.name, parsedType);
        }
      }
    }

    // 按 tag 分组 API
    const tagGroups = this.groupByTags(spec.paths);

    for (const [tag, operations] of Object.entries(tagGroups)) {
      const className = this.toPascalCase(tag);
      const parsedOperations: APIOperation[] = [];

      for (const op of operations) {
        // 转换参数格式
        const convertedParameters: Parameter[] | undefined = op.parameters ? 
          op.parameters.map((param: any) => ({
            name: param.name,
            type: param.in === 'path' ? 'string' : (this.mapOpenAPITypeToTS(param.schema?.type, param.schema) || 'unknown'),
            required: param.required || false,
            in: param.in
          })) : undefined;

        // 使用策略模式解析操作
        const parsedOp: APIOperation = {
          name: op.operationId!,
          method: op.method.toLowerCase(),
          path: op.path,
          summary: op.summary,
          description: op.description,
          parameters: convertedParameters,
          requestType: op.requestBody ? `${this.extractTypeNameFromOperationId(op.operationId)}Request` : undefined,
          responseType: `${this.extractTypeNameFromOperationId(op.operationId)}Response`
        };
        parsedOperations.push(parsedOp);
        
        // 生成请求/响应类型（去重） - 使用策略模式
        if (op.requestBody) {
          try {
            const typeName = `${this.extractTypeNameFromOperationId(op.operationId)}Request`;
            const requestType = this.parseRequestType(op);
            allTypes.set(requestType.name, requestType);
            console.log(`Successfully generated Request type: ${requestType.name} for ${op.operationId}`);
          } catch (error) {
            console.warn(`Failed to parse Request type: ${op.operationId} - ${error instanceof Error ? error.message : error}`);
            // 继续处理其他类型，不中断整个流程
          }
        }
        if (op.responses) {
          const typeName = `${this.extractTypeNameFromOperationId(op.operationId)}Response`;
          const responseType: TypeDefinition = {
            name: typeName,
            description: op.summary || `${op.operationId} 响应类型`,
            properties: { data: { type: 'unknown', required: false, description: '响应数据' } }
          };
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
          // 更智能地提取控制器名称
          const controllerName = pathSegments.length > 1 ? pathSegments[1] : 
                               pathSegments.length > 0 ? pathSegments[0] : 'api';
          const methodName = this.extractMethodFromPath(path, method);
          const suggestedId = `${controllerName}Controller_${methodName}`;
          const routePath = path.replace(`/api/${controllerName}`, '') || '/';
          errors.push(
            `${method.toUpperCase()} ${path}: Missing operationId\n` +
            `   Suggestion: Add to Controller: @ApiOperation({ operationId: '${suggestedId}' })\n` +
            `   Or: @${method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()}('${routePath}', { operationId: '${suggestedId}' })`
          );
          continue;
        }
        
        const match = operation.operationId.match(/^([a-zA-Z]+?)(?:controller)?[_]([a-zA-Z]+)/i);
        if (!match) {
          const pathSegments = path.split('/').filter(Boolean);
          // 更智能地提取控制器名称
          const controllerName = pathSegments.length > 1 ? pathSegments[1] : 
                               pathSegments.length > 0 ? pathSegments[0] : 'your';
          const methodName = this.extractMethodFromPath(path, method);
          const suggestedId = `${controllerName}Controller_${methodName}`;

          
          errors.push(
            `${method.toUpperCase()} ${path}: operationId "${operation.operationId}" format incorrect\n` +
            `   Expected format: "controllerName_methodName" or "controllerNameController_methodName"\n` +
            `   Suggested fix: "${suggestedId}"\n` +
            `   Modify in Controller: @ApiOperation({ operationId: '${suggestedId}' })`
          );
          continue;
        }
        
        // 转换为驼峰命名，去掉Controller后缀
        const controllerName = match[1].replace(/controller$/i, ''); // 去掉controller后缀
        tag = this.toPascalCase(controllerName);
        
        // 调试信息：显示分组结果
        
        if (!groups[tag]) {
          groups[tag] = [];
        }
        // 转换参数格式
        const convertedParameters: Parameter[] | undefined = operation.parameters ? 
          operation.parameters.map((param: any) => ({
            name: param.name,
            type: param.in === 'path' ? 'string' : (this.mapOpenAPITypeToTS(param.schema?.type, param.schema) || 'unknown'),
            required: param.required || false,
            in: param.in
          })) : undefined;

        // 类型转换，确保类型兼容
        const operationWithPath: OperationWithPath = {
          path,
          method,
          ...operation,
          parameters: convertedParameters
        };
        groups[tag].push(operationWithPath);
      }
    }
    
    // 如果有错误，输出所有错误信息并继续生成
    if (errors.length > 0) {
      console.warn('\nFound the following operationId format issues:');
      console.warn('='.repeat(60));
      errors.forEach((error, index) => {
        console.warn(`\n${index + 1}. ${error}`);
      });
      console.warn('\noperationId naming convention:');
      console.warn('   格式: {controllerName}Controller_{methodName} 或 {controllerName}_{methodName}');
      console.warn('   示例: userController_getUsers, orderController_createOrder');
      console.warn('   注意: 使用驼峰命名，controllerName应与文件名对应');
      console.warn('='.repeat(60));
      console.warn(`Found ${errors.length} format issues, continuing generation but may affect code quality and readability`);
      console.warn('Suggestion: Fix according to the above specifications and regenerate for best code quality\n');
    }
    
    return groups;
  }
  
  /**
   * 从路径和HTTP方法推断方法名（增强版 - 支持复杂嵌套路径）
   */
  private extractMethodFromPath(path: string, method: string): string {
    const httpMethod = method.toLowerCase();
    
    // 解析路径，提取关键信息
    const pathSegments = path.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // 分析路径结构，识别操作意图
    const pathAnalysis = this.analyzePathStructure(pathSegments);
    
    // 基于HTTP方法和路径结构生成方法名
    let methodName = '';
    
    switch (httpMethod) {
      case 'get':
        methodName = this.generateGetMethodName(pathAnalysis, pathSegments);
        break;
      case 'post':
        methodName = this.generatePostMethodName(pathAnalysis, pathSegments);
        break;
      case 'put':
        methodName = this.generatePutMethodName(pathAnalysis, pathSegments);
        break;
      case 'patch':
        methodName = this.generatePatchMethodName(pathAnalysis, pathSegments);
        break;
      case 'delete':
        methodName = this.generateDeleteMethodName(pathAnalysis, pathSegments);
        break;
      case 'head':
        methodName = pathAnalysis.versionPrefix ? `head${pathAnalysis.versionPrefix}` : 'head';
        break;
      case 'options':
        methodName = pathAnalysis.versionPrefix ? `options${pathAnalysis.versionPrefix}` : 'options';
        break;
      default:
        methodName = httpMethod;
    }
    
    return methodName;
  }
  
  /**
   * 分析路径结构，提取参数数量和版本信息
   */
  private analyzePathStructure(pathSegments: string[]): PathAnalysis {
    const params = pathSegments.filter(seg => seg.includes('{'));
    
    // 识别版本信息 (v1, v2, v3等)
    const versionSegment = pathSegments.find(seg => /^v\d+$/i.test(seg));
    const versionPrefix = versionSegment ? versionSegment.toUpperCase() : null;
    
    return {
      paramCount: params.length,
      versionPrefix
    };
  }
  
  /**
   * 生成GET方法名 - 基于URI结构，便于识别对应路径，包含版本信息
   */
  private generateGetMethodName(analysis: PathAnalysis, pathSegments: string[]): string {
    const { paramCount, versionPrefix } = analysis;
    
    // 过滤掉常见的API前缀，但保留版本信息，获取实际的业务资源路径
    const businessSegments = pathSegments.filter(seg => 
      !seg.includes('{') && 
      !['api'].includes(seg.toLowerCase()) &&
      !/^v\d+$/i.test(seg)  // 版本信息单独处理
    );
    
    if (businessSegments.length === 0) {
      const baseMethodName = paramCount > 0 ? 'getById' : 'getList';
      return versionPrefix ? `get${versionPrefix}${baseMethodName.slice(3)}` : baseMethodName;
    }
    
    // 构建资源路径
    const resourcePath = businessSegments.map(seg => this.toPascalCase(seg)).join('');
    
    // 构建基础方法名
    let baseMethodName: string;
    if (paramCount > 0) {
      baseMethodName = `get${resourcePath}ById`;
    } else {
      baseMethodName = `get${resourcePath}`;
    }
    
    // 如果有版本信息，在方法名中体现
    return versionPrefix ? `get${versionPrefix}${baseMethodName.slice(3)}` : baseMethodName;
  }
  
  /**
   * 生成POST方法名 - 基于URI结构，便于识别对应路径，包含版本信息
   */
  private generatePostMethodName(analysis: PathAnalysis, pathSegments: string[]): string {
    const { versionPrefix } = analysis;
    
    // 过滤掉常见的API前缀，但保留版本信息，获取实际的业务资源路径
    const businessSegments = pathSegments.filter(seg => 
      !seg.includes('{') && 
      !['api'].includes(seg.toLowerCase()) &&
      !/^v\d+$/i.test(seg)  // 版本信息单独处理
    );
    
    if (businessSegments.length === 0) {
      return versionPrefix ? `create${versionPrefix}` : 'create';
    }
    
    // 构建资源路径
    const resourcePath = businessSegments.map(seg => this.toPascalCase(seg)).join('');
    const baseMethodName = `create${resourcePath}`;
    
    // 如果有版本信息，在方法名中体现
    return versionPrefix ? `create${versionPrefix}${baseMethodName.slice(6)}` : baseMethodName;
  }
  
  /**
   * 生成PUT方法名 - 基于URI结构，便于识别对应路径，包含版本信息
   */
  private generatePutMethodName(analysis: PathAnalysis, pathSegments: string[]): string {
    const { versionPrefix } = analysis;
    
    // 过滤掉常见的API前缀，但保留版本信息，获取实际的业务资源路径
    const businessSegments = pathSegments.filter(seg => 
      !seg.includes('{') && 
      !['api'].includes(seg.toLowerCase()) &&
      !/^v\d+$/i.test(seg)  // 版本信息单独处理
    );
    
    if (businessSegments.length === 0) {
      return versionPrefix ? `update${versionPrefix}` : 'update';
    }
    
    // 构建资源路径
    const resourcePath = businessSegments.map(seg => this.toPascalCase(seg)).join('');
    const baseMethodName = `update${resourcePath}`;
    
    // 如果有版本信息，在方法名中体现
    return versionPrefix ? `update${versionPrefix}${baseMethodName.slice(6)}` : baseMethodName;
  }
  
  /**
   * 生成PATCH方法名 - 基于URI结构，便于识别对应路径，包含版本信息
   */
  private generatePatchMethodName(analysis: PathAnalysis, pathSegments: string[]): string {
    const { versionPrefix } = analysis;
    
    // 过滤掉常见的API前缀，但保留版本信息，获取实际的业务资源路径
    const businessSegments = pathSegments.filter(seg => 
      !seg.includes('{') && 
      !['api'].includes(seg.toLowerCase()) &&
      !/^v\d+$/i.test(seg)  // 版本信息单独处理
    );
    
    if (businessSegments.length === 0) {
      return versionPrefix ? `patch${versionPrefix}` : 'patch';
    }
    
    // 构建资源路径
    const resourcePath = businessSegments.map(seg => this.toPascalCase(seg)).join('');
    const baseMethodName = `patch${resourcePath}`;
    
    // 如果有版本信息，在方法名中体现
    return versionPrefix ? `patch${versionPrefix}${baseMethodName.slice(5)}` : baseMethodName;
  }
  
  /**
   * 生成DELETE方法名 - 基于URI结构，便于识别对应路径，包含版本信息
   */
  private generateDeleteMethodName(analysis: PathAnalysis, pathSegments: string[]): string {
    const { versionPrefix } = analysis;
    
    // 过滤掉常见的API前缀，但保留版本信息，获取实际的业务资源路径
    const businessSegments = pathSegments.filter(seg => 
      !seg.includes('{') && 
      !['api'].includes(seg.toLowerCase()) &&
      !/^v\d+$/i.test(seg)  // 版本信息单独处理
    );
    
    if (businessSegments.length === 0) {
      return versionPrefix ? `delete${versionPrefix}` : 'delete';
    }
    
    // 构建资源路径
    const resourcePath = businessSegments.map(seg => this.toPascalCase(seg)).join('');
    const baseMethodName = `delete${resourcePath}`;
    
    // 如果有版本信息，在方法名中体现
    return versionPrefix ? `delete${versionPrefix}${baseMethodName.slice(6)}` : baseMethodName;
  }
  
  /**
   * 转换为PascalCase命名 - 直接使用change-case库
   */
  private toPascalCase(str: string): string {
    return pascalCase(str);
  }


  /**
   * 类型守卫：检查是否为SchemaObject
   */
  private isSchemaObject(obj: unknown): obj is SchemaObject {
    return typeof obj === 'object' && obj !== null && !('$ref' in obj);
  }

  /**
   * 映射 OpenAPI 类型到 TypeScript 类型
   * @returns 返回具体类型，如果无法推导则返回null
   */
  private mapOpenAPITypeToTS(openApiType?: string, schema?: any): string | null {
    switch (openApiType) {
      case 'string':
        return 'string';
      case 'number':
      case 'integer':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'array':
        // 检查数组元素类型
        if (schema?.items?.type) {
          const itemType = this.mapOpenAPITypeToTS(schema.items.type, schema.items);
          if (itemType) {
            return `${itemType}[]`;
          }
        }
        // 如果无法推导数组元素类型，返回null
        return null;
      case 'object':
        return 'Record<string, unknown>';
      default:
        // 无法推导的类型返回null
        return null;
    }
  }

  /**
   * 类型守卫：检查是否为ReferenceObject
   */
  private isReferenceObject(obj: unknown): obj is OpenAPIV3.ReferenceObject {
    return typeof obj === 'object' && obj !== null && '$ref' in obj;
  }

  private parseSchema(name: string, schema: SchemaObject): TypeDefinition {

    const properties: Record<string, TypeProperty> = {};
    
    if (schema.properties) {
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        // 明确类型化属性模式
        const prop = this.isSchemaObject(propSchema) ? propSchema : { type: 'string' };
        
        // 尝试推导类型
        const mappedType = this.mapOpenAPITypeToTS(prop.type, prop);
        
        // 如果无法推导出具体类型，发出警告并跳过该字段
        if (!mappedType || mappedType === 'unknown') {
          console.warn(`Field type inference failed: ${name}.${propName} - Missing explicit type definition, suggest adding specific type property in OpenAPI specification`);
          continue; // 跳过该字段，不添加到类型定义中
        }
        
        properties[propName] = {
          type: mappedType,
          required: schema.required?.includes(propName) || false,
          description: this.isSchemaObject(propSchema) ? propSchema.description : undefined,
          // OpenAPI 验证属性（只有当是 SchemaObject 时才访问）
          format: this.isSchemaObject(propSchema) ? propSchema.format : undefined,
          pattern: this.isSchemaObject(propSchema) ? propSchema.pattern : undefined,
          minimum: this.isSchemaObject(propSchema) ? propSchema.minimum : undefined,
          maximum: this.isSchemaObject(propSchema) ? propSchema.maximum : undefined,
          exclusiveMinimum: this.isSchemaObject(propSchema) && typeof propSchema.exclusiveMinimum === 'number' ? propSchema.exclusiveMinimum : undefined,
          exclusiveMaximum: this.isSchemaObject(propSchema) && typeof propSchema.exclusiveMaximum === 'number' ? propSchema.exclusiveMaximum : undefined,
          minLength: this.isSchemaObject(propSchema) ? propSchema.minLength : undefined,
          maxLength: this.isSchemaObject(propSchema) ? propSchema.maxLength : undefined,
          minItems: this.isSchemaObject(propSchema) ? propSchema.minItems : undefined,
          maxItems: this.isSchemaObject(propSchema) ? propSchema.maxItems : undefined,
          uniqueItems: this.isSchemaObject(propSchema) ? propSchema.uniqueItems : undefined
        };
      }
    }

    return { 
      name: this.toPascalCase(name), 
      description: schema.description,
      properties 
    };
  }

  private parseRequestType(op: OperationWithPath): TypeDefinition {
    // 解析请求体类型
    const requestBody = op.requestBody;
    if (!requestBody) {
      throw new Error(
        `Missing requestBody for operation "${op.operationId}" at ${op.method.toUpperCase()} ${op.path}. ` +
        `Please define requestBody in your OpenAPI specification.`
      );
    }
    
    if ('$ref' in requestBody) {
      throw new Error(
        `RequestBody $ref not supported for operation "${op.operationId}" at ${op.method.toUpperCase()} ${op.path}. ` +
        `Please inline the requestBody definition.`
      );
    }
    
    let schema = requestBody.content?.['application/json']?.schema;
    if (!schema) {
      throw new Error(
        `Missing application/json schema in requestBody for operation "${op.operationId}" at ${op.method.toUpperCase()} ${op.path}. ` +
        `Please define the schema for your request body.`
      );
    }
    
    const typeName = `${this.extractTypeNameFromOperationId(op.operationId)}Request`;
    
    // 处理 $ref 引用
    if ('$ref' in schema) {
      const refName = this.extractRefName(schema.$ref);
      return { name: this.toPascalCase(refName), description: undefined, properties: {} };
    }
    
    const parsedType = this.parseSchema(typeName, this.isSchemaObject(schema) ? schema : { type: "object" });
    
    // 如果 schema 是空的 object，要求开发者完善规范
    if (Object.keys(parsedType.properties).length === 0 && (schema as SchemaObject).type === 'object') {
      throw new Error(
        `Empty object schema in requestBody for operation "${op.operationId}" at ${op.method.toUpperCase()} ${op.path}. ` +
        `Please define specific properties for your request body schema.`
      );
    }
    
    return parsedType;
  }

  /**
   * 从$ref路径中提取schema名称
   */
  private extractRefName(ref: string): string {
    // 从 "#/components/schemas/CreateUserRequest" 中提取 "CreateUserRequest"
    const parts = ref.split('/');
    return parts[parts.length - 1];
  }

  private parseResponseType(op: OperationWithPath): TypeDefinition {
    // 解析响应类型
    const response200 = op.responses['200'];
    if (!response200) {
      throw new Error(
        `Missing 200 response for operation "${op.operationId}" at ${op.method.toUpperCase()} ${op.path}. ` +
        `Please define a 200 response in your OpenAPI specification.`
      );
    }
    
    if ('$ref' in response200) {
      throw new Error(
        `Response $ref not supported for operation "${op.operationId}" at ${op.method.toUpperCase()} ${op.path}. ` +
        `Please inline the response definition.`
      );
    }
    
    let schema = response200.content?.['application/json']?.schema;
    if (!schema) {
      throw new Error(
        `Missing application/json schema in 200 response for operation "${op.operationId}" at ${op.method.toUpperCase()} ${op.path}. ` +
        `Please define the schema for your response body.`
      );
    }
    
    const typeName = `${this.extractTypeNameFromOperationId(op.operationId)}Response`;
    
    // 处理 $ref 引用
    if ('$ref' in schema) {
      const refName = this.extractRefName(schema.$ref);
      return { name: this.toPascalCase(refName), description: undefined, properties: {} };
    }
    
    const parsedType = this.parseSchema(typeName, this.isSchemaObject(schema) ? schema : { type: "object" });
    
    // 如果 schema 是空的 object，要求开发者完善规范
    if (Object.keys(parsedType.properties).length === 0 && (schema as SchemaObject).type === 'object') {
      throw new Error(
        `Empty object schema in 200 response for operation "${op.operationId}" at ${op.method.toUpperCase()} ${op.path}. ` +
        `Please define specific properties for your response body schema.`
      );
    }
    
    return parsedType;
  }

  /**
   * 从 operationId 提取纯净的类型名称
   * 移除 Controller/Api 等前缀，转换为 PascalCase 用于生成类型名
   */
  private extractTypeNameFromOperationId(operationId?: string): string {
    if (!operationId) {
      throw new Error('operationId is required for generating type names');
    }
    
    // 移除控制器前缀，只保留核心操作名
    // 例如: admindashboard_getalertescalations -> getalertescalations
    let cleanName = operationId.replace(/^[^_]+_/, ''); // 移除第一个下划线之前的所有内容
    
    // 如果移除前缀后为空，说明 operationId 格式有问题
    if (!cleanName.trim()) {
      throw new Error(`Invalid operationId format: "${operationId}". Expected format: "controllerName_methodName"`);
    }
    
    // 转换为 PascalCase 用于类型名
    return this.toPascalCase(cleanName);
  }



}

// 辅助类型
interface OperationWithPath extends OperationSpec {
  path: string;
  method: string;
  parameters?: Parameter[]; // 添加parameters字段
}