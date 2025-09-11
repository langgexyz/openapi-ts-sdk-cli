/**
 * 基于策略模式的OpenAPI解析系统 - 通用且可扩展
 */

import { ParsedType, TypeProperty, ParsedOperation, ParsedParameter } from './openapi-parser';
import { OpenAPIV3 } from 'openapi-types';

// 使用标准OpenAPI类型定义
type OpenAPISpec = OpenAPIV3.Document;
type SchemaObject = OpenAPIV3.SchemaObject;
type ReferenceObject = OpenAPIV3.ReferenceObject;
type ParameterObject = OpenAPIV3.ParameterObject;
type RequestBodyObject = OpenAPIV3.RequestBodyObject;
type ResponseObject = OpenAPIV3.ResponseObject;
type MediaTypeObject = OpenAPIV3.MediaTypeObject;
type OperationObject = OpenAPIV3.OperationObject;

// 扩展的操作对象 - 包含路径信息
export interface OperationWithPath extends OperationObject {
  path: string;
  method: string;
}

// 类型守卫函数
export function isReferenceObject(obj: unknown): obj is ReferenceObject {
  return typeof obj === 'object' && obj !== null && '$ref' in obj;
}

export function isSchemaObject(obj: unknown): obj is SchemaObject {
  return typeof obj === 'object' && obj !== null && !('$ref' in obj);
}

export function isParameterObject(obj: unknown): obj is ParameterObject {
  return typeof obj === 'object' && obj !== null && !('$ref' in obj) && 'name' in obj && 'in' in obj;
}

export function isRequestBodyObject(obj: unknown): obj is RequestBodyObject {
  return typeof obj === 'object' && obj !== null && !('$ref' in obj) && 'content' in obj;
}

/**
 * 解析策略接口
 */
export interface ParsingStrategy {
  /**
   * 策略名称
   */
  name: string;
  
  /**
   * 检查是否适用于该解析任务
   */
  canHandle(data: unknown): boolean;
  
  /**
   * 执行解析
   */
  parse(data: unknown, context?: unknown): unknown;
  
  /**
   * 策略优先级 (数字越小优先级越高)
   */
  priority: number;
}

/**
 * Schema解析策略 - 直接保持TypeScript类型
 */
export class SchemaParsingStrategy implements ParsingStrategy {
  name = 'schema-parsing';
  priority = 10;

  canHandle(data: unknown): boolean {
    return !!(data && typeof data === 'object' && 
           ('type' in data || 'properties' in data || '$ref' in data));
  }

  parse(schemaData: { name: string; schema: SchemaObject | ReferenceObject }): ParsedType {
    const { name, schema } = schemaData;
    const properties: Record<string, TypeProperty> = {};
    
    // 处理引用类型
    if (isReferenceObject(schema)) {
      return {
        name,
        description: undefined,
        properties: {}
      };
    }
    
    // 处理 Schema 对象
    if (schema.properties) {
      for (const [propName, propSchema] of Object.entries(schema.properties)) {
        // 解析属性 schema
        let propType = 'any';
        let propDescription: string | undefined;
        let validationProps: Partial<TypeProperty> = {};
        
        if (isReferenceObject(propSchema)) {
          // 引用类型，从引用名称推断类型
          const refName = propSchema.$ref.split('/').pop();
          propType = refName || 'any';
        } else if (isSchemaObject(propSchema)) {
          propType = propSchema.type || 'any';
          propDescription = propSchema.description;
          
          // 提取验证属性
          validationProps = {
            format: propSchema.format,
            pattern: propSchema.pattern,
            minimum: propSchema.minimum,
            maximum: propSchema.maximum,
            exclusiveMinimum: typeof propSchema.exclusiveMinimum === 'number' 
              ? propSchema.exclusiveMinimum : undefined,
            exclusiveMaximum: typeof propSchema.exclusiveMaximum === 'number' 
              ? propSchema.exclusiveMaximum : undefined,
            minLength: propSchema.minLength,
            maxLength: propSchema.maxLength,
            minItems: propSchema.minItems,
            maxItems: propSchema.maxItems,
            uniqueItems: propSchema.uniqueItems
          };
        }
        
        properties[propName] = {
          type: propType,
          required: schema.required?.includes(propName) || false,
          description: propDescription,
          ...validationProps
        };
      }
    }

    return { 
      name,
      description: schema.description,
      properties 
    };
  }
}

/**
 * $ref引用解析策略
 */
export class RefParsingStrategy implements ParsingStrategy {
  name = 'ref-parsing';
  priority = 5; // 高优先级，优先处理引用

  canHandle(data: unknown): boolean {
    return !!(data && typeof data === 'object' && '$ref' in data);
  }

  parse(refData: { schema: ReferenceObject; fallbackName?: string }): ParsedType {
    const { schema, fallbackName } = refData;
    const refName = this.extractRefName(schema.$ref);
    
    return { 
      name: refName,
      description: undefined,
      properties: {} 
    };
  }

  private extractRefName(ref: string): string {
    // 从 "#/components/schemas/CreateUserRequest" 中提取 "CreateUserRequest"
    const parts = ref.split('/');
    return parts[parts.length - 1];
  }
}

/**
 * 请求类型解析策略
 */
export class RequestTypeParsingStrategy implements ParsingStrategy {
  name = 'request-type-parsing';
  priority = 20;

  private schemaStrategy = new SchemaParsingStrategy();
  private refStrategy = new RefParsingStrategy();

  canHandle(data: unknown): boolean {
    return !!(data && typeof data === 'object' && 
           'operation' in data && 
           typeof data.operation === 'object' && 
           data.operation !== null &&
           'requestBody' in data.operation);
  }

  parse(requestData: { operation: OperationWithPath; typeName: string }): ParsedType {
    const { operation, typeName } = requestData;
    
    if (!operation.requestBody || !isRequestBodyObject(operation.requestBody)) {
      return this.generateEmptyType(typeName);
    }

    const mediaType = operation.requestBody.content['application/json'];
    if (!mediaType || !mediaType.schema) {
      return this.generateEmptyType(typeName);
    }

    const schema = mediaType.schema;

    // 使用ref策略处理引用
    if (this.refStrategy.canHandle(schema)) {
      return this.refStrategy.parse({ schema: schema as ReferenceObject });
    }

    // 使用schema策略处理内联schema
    if (this.schemaStrategy.canHandle(schema)) {
      return this.schemaStrategy.parse({ name: typeName, schema: schema as SchemaObject });
    }

    return this.generateEmptyType(typeName);
  }

  private generateEmptyType(name: string): ParsedType {
    return {
      name,
      description: undefined,
      properties: {}
    };
  }
}

/**
 * 响应类型解析策略
 */
export class ResponseTypeParsingStrategy implements ParsingStrategy {
  name = 'response-type-parsing';
  priority = 20;

  private schemaStrategy = new SchemaParsingStrategy();
  private refStrategy = new RefParsingStrategy();

  canHandle(data: unknown): boolean {
    return !!(data && typeof data === 'object' && 
           'operation' in data && 
           typeof data.operation === 'object' && 
           data.operation !== null &&
           'responses' in data.operation);
  }

  parse(responseData: { operation: OperationWithPath; typeName: string }): ParsedType {
    const { operation, typeName } = responseData;
    
    const response200 = operation.responses['200'];
    if (!response200) {
      return this.generateEmptyType(typeName);
    }

    // 检查是否为引用对象
    if (isReferenceObject(response200)) {
      return this.generateEmptyType(typeName);
    }

    const mediaType = response200.content?.['application/json'];
    if (!mediaType || !mediaType.schema) {
      return this.generateEmptyType(typeName);
    }

    const schema = mediaType.schema;

    // 使用ref策略处理引用
    if (this.refStrategy.canHandle(schema)) {
      return this.refStrategy.parse({ schema: schema as ReferenceObject });
    }

    // 使用schema策略处理内联schema
    if (this.schemaStrategy.canHandle(schema)) {
      return this.schemaStrategy.parse({ name: typeName, schema: schema as SchemaObject });
    }

    return this.generateEmptyType(typeName);
  }

  private generateEmptyType(name: string): ParsedType {
    return {
      name,
      description: undefined,
      properties: {}
    };
  }
}

/**
 * 操作解析策略
 */
export class OperationParsingStrategy implements ParsingStrategy {
  name = 'operation-parsing';
  priority = 30;

  canHandle(data: unknown): boolean {
    return !!(data && typeof data === 'object' && 
           'path' in data && 
           'method' in data && 
           'operationId' in data && 
           typeof data.operationId === 'string');
  }

  parse(operation: OperationWithPath): ParsedOperation {
    return {
      name: operation.operationId!,
      method: operation.method.toLowerCase(),
      path: operation.path,
      summary: operation.summary,
      description: operation.description,
      parameters: this.parseParameters(operation.parameters),
      requestType: this.determineRequestType(operation),
      responseType: this.determineResponseType(operation)
    };
  }

  private parseParameters(parameters?: (ParameterObject | ReferenceObject)[]): ParsedParameter[] {
    if (!parameters) return [];
    
    return parameters
      .filter(isParameterObject) // 只处理 ParameterObject，忽略引用
      .map(p => ({
        name: p.name,
        type: p.schema && isSchemaObject(p.schema) ? p.schema.type || 'string' : 'string',
        required: p.required || false,
        in: (p.in === 'cookie' ? 'header' : p.in) as 'query' | 'path' | 'header' | 'body' | 'cookie'
      }));
  }

  private determineRequestType(operation: OperationWithPath): string | undefined {
    if (!operation.requestBody) return undefined;
    
    // 简单的类型名生成，基于operationId
    const baseName = operation.operationId?.replace(/controller/i, '') || 'Request';
    return `${baseName}Request`;
  }

  private determineResponseType(operation: OperationWithPath): string {
    // 始终生成具体的响应类型名，即使没有 responses 定义
    const baseName = operation.operationId?.replace(/controller/i, '') || 'Response';
    return `${baseName}Response`;
  }
}

/**
 * 解析策略管理器
 */
export class ParsingStrategyManager {
  private strategies: ParsingStrategy[] = [];

  constructor() {
    // 注册默认策略
    this.registerStrategy(new RefParsingStrategy());
    this.registerStrategy(new SchemaParsingStrategy());
    this.registerStrategy(new RequestTypeParsingStrategy());
    this.registerStrategy(new ResponseTypeParsingStrategy());
    this.registerStrategy(new OperationParsingStrategy());
  }

  /**
   * 注册解析策略
   */
  registerStrategy(strategy: ParsingStrategy): void {
    this.strategies.push(strategy);
    this.strategies.sort((a, b) => a.priority - b.priority);
  }

  /**
   * 根据策略名称执行解析
   */
  parseByStrategy(strategyName: string, data: unknown, context?: unknown): unknown {
    const strategy = this.strategies.find(s => s.name === strategyName);
    if (!strategy) {
      throw new Error(`Unknown parsing strategy: ${strategyName}`);
    }
    return strategy.parse(data, context);
  }

  /**
   * 自动选择合适的策略进行解析
   */
  parseAuto(data: unknown, context?: unknown): unknown {
    for (const strategy of this.strategies) {
      if (strategy.canHandle(data)) {
        return strategy.parse(data, context);
      }
    }
    throw new Error('No suitable parsing strategy found for the given data');
  }

  /**
   * 获取所有可用的策略名称
   */
  getAvailableStrategies(): string[] {
    return this.strategies.map(s => s.name);
  }
}
