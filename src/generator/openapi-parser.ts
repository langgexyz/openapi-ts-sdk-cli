/**
 * OpenAPI 解析器 - 将 OpenAPI 规范解析为可用于代码生成的数据结构
 */

export interface OpenAPISpec {
  openapi: string;
  info: {
    title?: string;
    version?: string;
    description?: string;
  };
  paths: Record<string, Record<string, OperationSpec>>;
  components?: {
    schemas?: Record<string, SchemaObject>;
  };
}

export interface SchemaObject {
  type?: string;
  properties?: Record<string, SchemaObject>;
  required?: string[];
  description?: string;
  items?: SchemaObject;
  [key: string]: unknown;
}

export interface OperationSpec {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  requestBody?: RequestBodyObject;
  responses: Record<string, ResponseObject>;
  parameters?: ParameterObject[];
}

export interface RequestBodyObject {
  content?: {
    'application/json'?: {
      schema?: SchemaObject;
    };
  };
  [key: string]: unknown;
}

export interface ResponseObject {
  content?: {
    'application/json'?: {
      schema?: SchemaObject;
    };
  };
  [key: string]: unknown;
}

export interface ParameterObject {
  name: string;
  in: 'query' | 'path' | 'header' | 'cookie';
  required?: boolean;
  schema?: SchemaObject;
  [key: string]: unknown;
}

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
  properties: Record<string, TypeProperty>;
}

export interface TypeProperty {
  type: string;
  required: boolean;
  description?: string;
}

export class OpenAPIParser {
  parse(spec: OpenAPISpec): ParsedAPI[] {
    const apis: ParsedAPI[] = [];
    const allTypes: Map<string, ParsedType> = new Map();

    // 解析 schemas 生成类型
    if (spec.components?.schemas) {
      for (const [name, schema] of Object.entries(spec.components.schemas)) {
        const parsedType = this.parseSchema(name, schema);
        allTypes.set(parsedType.name, parsedType);
      }
    }

    // 按 tag 分组 API
    const tagGroups = this.groupByTags(spec.paths);

    for (const [tag, operations] of Object.entries(tagGroups)) {
      const className = this.toClassName(tag);
      const parsedOperations: ParsedOperation[] = [];

      for (const op of operations) {
        parsedOperations.push(this.parseOperation(op));
        
        // 生成请求/响应类型（去重）
        if (op.requestBody) {
          const requestType = this.parseRequestType(op);
          allTypes.set(requestType.name, requestType);
        }
        if (op.responses) {
          const responseType = this.parseResponseType(op);
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

  private groupByTags(paths: Record<string, Record<string, OperationSpec>>) {
    const groups: Record<string, OperationWithPath[]> = {};
    
    for (const [path, methods] of Object.entries(paths)) {
      for (const [method, operation] of Object.entries(methods)) {
        // 优先使用 operationId 中的 Controller 信息进行分组
        let tag = 'Default';
        
        if (operation.operationId) {
          // 从 operationId 提取 Controller 名（如 TwitterController_xxx）
          const controllerMatch = operation.operationId.match(/^(.+?)Controller[_]/);
          if (controllerMatch) {
            tag = controllerMatch[1];
          } else {
            // 尝试提取前缀（如 Twitter_xxx）
            const prefixMatch = operation.operationId.match(/^([A-Z][a-zA-Z]*?)_/);
            if (prefixMatch) {
              tag = prefixMatch[1];
            }
          }
        }
        
        // 如果上述方法都失败，使用 tags
        if (tag === 'Default' && operation.tags?.[0]) {
          tag = operation.tags[0];
        }
        
        if (!groups[tag]) {
          groups[tag] = [];
        }
        groups[tag].push({ path, method, ...operation });
      }
    }
    
    return groups;
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
      parameters: op.parameters?.map((p: ParameterObject) => ({
        name: p.name,
        type: this.mapType(p.schema?.type || 'string', p.schema),
        required: p.required || false,
        in: p.in === 'cookie' ? 'header' : p.in // 将 cookie 参数映射为 header 参数
      })) || []
    };
  }

  private parseSchema(name: string, schema: SchemaObject): ParsedType {
    const properties: Record<string, TypeProperty> = {};
    
    if (schema.properties) {
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        properties[propName] = {
          type: this.mapType(propSchema.type, propSchema),
          required: schema.required?.includes(propName) || false,
          description: propSchema.description
        };
      }
    }

    return { name: this.toClassName(name), properties };
  }

  private parseRequestType(op: OperationWithPath): ParsedType {
    // 解析请求体类型
    const schema = op.requestBody?.content?.['application/json']?.schema;
    const typeName = `${this.simplifyOperationName(op.operationId)}Request`;
    
    if (schema) {
      const parsedType = this.parseSchema(typeName, schema);
      
      // 如果 schema 只是空的 object，尝试推断一些通用字段
      if (Object.keys(parsedType.properties).length === 0 && schema.type === 'object') {
        return this.generateDefaultRequestType(op, typeName);
      }
      
      return parsedType;
    }
    
    return this.generateDefaultRequestType(op, typeName);
  }

  private parseResponseType(op: OperationWithPath): ParsedType {
    // 解析响应类型
    const schema = op.responses['200']?.content?.['application/json']?.schema;
    const typeName = `${this.simplifyOperationName(op.operationId)}Response`;
    
    if (schema) {
      const parsedType = this.parseSchema(typeName, schema);
      
      // 如果 schema 只是空的 object，生成默认的响应类型
      if (Object.keys(parsedType.properties).length === 0 && schema.type === 'object') {
        return this.generateDefaultResponseType(op, typeName);
      }
      
      return parsedType;
    }
    
    return this.generateDefaultResponseType(op, typeName);
  }

  /**
   * 简化操作名，移除冗余的 Controller 前缀
   */
  private simplifyOperationName(operationId?: string): string {
    if (!operationId) return 'Unknown';
    
    // 移除 Controller 前缀，只保留操作名
    return operationId
      .replace(/^.*Controller_?/, '') // 移除 XxxController_ 前缀
      .replace(/^[a-z]/, char => char.toUpperCase()); // 首字母大写
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
        type: 'Record<string, unknown>',  // ✅ 使用 unknown 替代 any
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

  private mapType(type?: string, schema?: SchemaObject): string {
    if (!type) return 'unknown';
    
    // 处理数组类型
    if (type === 'array' && schema?.items) {
      const itemType = this.mapType(schema.items.type, schema.items);
      return `${itemType}[]`;
    }
    
    // 处理对象类型 - 检查是否有具体的属性定义
    if (type === 'object' && schema?.properties) {
      // 如果有具体的属性定义，生成内联接口
      const properties = Object.entries(schema.properties)
        .map(([key, prop]) => {
          const propType = this.mapType(prop.type, prop);
          const optional = schema.required?.includes(key) ? '' : '?';
          return `${key}${optional}: ${propType}`;
        })
        .join('; ');
      return `{ ${properties} }`;
    }
    
    // ✅ 改进的基础类型映射
    const typeMap: Record<string, string> = {
      'string': 'string',
      'number': 'number',
      'integer': 'number',
      'boolean': 'boolean',
      'object': 'Record<string, unknown>', // ✅ 使用 unknown 替代 any
      'array': 'unknown[]' // ✅ 改进的数组类型
    };
    
    return typeMap[type] || 'unknown'; // ✅ 使用 unknown 替代 any
  }
}

// 辅助类型
interface OperationWithPath extends OperationSpec {
  path: string;
  method: string;
}