/**
 * 代码生成器 - 基于解析的 OpenAPI 数据生成 TypeScript 代码
 */

import Handlebars from 'handlebars';
import { pascalCase, camelCase } from 'change-case';
import { ParsedAPI, ParsedType, ParsedOperation, TypeProperty } from './openapi-parser';
import { ValidationStrategyManager } from './validation-strategies';
import { TemplateStrategyManager } from './template-strategies';

export interface GeneratorOptions {
  className?: string;
  packageName?: string;
  projectName?: string;
}

export class CodeGenerator {
  private validationManager: ValidationStrategyManager;
  private templateManager: TemplateStrategyManager;

  constructor() {
    this.validationManager = new ValidationStrategyManager();
    this.templateManager = new TemplateStrategyManager();
    this.registerHelpers();
  }

  /**
   * 生成 TypeScript 代码 - 支持多文件生成
   */
  generate(apis: ParsedAPI[], options: GeneratorOptions): Map<string, string> {
    const files = new Map<string, string>();
    
    // 生成共享的基础类型和基类
    const typesContent = this.generateSharedApiTypes();
    files.set('types.ts', typesContent);
    
    // 按 Controller 分组并生成独立的 API 文件
    const controllerGroups = this.groupByController(apis);
    
    for (const [controllerName, controllerApis] of controllerGroups) {
      const apiContent = this.generateControllerApi(controllerName, controllerApis, options);
      files.set(`${controllerName.toLowerCase()}.ts`, apiContent); // 去掉.api后缀
    }
    
    // 生成主入口文件
    const indexContent = this.generateIndexFile(Array.from(controllerGroups.keys()));
    files.set('index.ts', indexContent);

    return files;
  }

  /**
   * 生成导入语句
   */
  private generateImports(options: GeneratorOptions): string {
    const packageName = options.packageName || 'ts-sdk-client';
    
    return `import { 
  HttpBuilder, HttpMethod 
} from '${packageName}';

`;
  }

  /**
   * 生成类型定义
   */
  private generateTypes(types: ParsedType[]): string {
    return types.map(type => this.generateTypeInterface(type)).join('\n');
  }

  /**
   * 生成单个类型接口
   */
  private generateTypeInterface(type: ParsedType): string {
    const properties = Object.entries(type.properties)
      .map(([name, prop]: [string, TypeProperty]) => {
        const optional = prop.required ? '' : '?';
        const comment = prop.description ? ` // ${prop.description}` : '';
        return `  ${name}${optional}: ${prop.type};${comment}`;
      })
      .join('\n');

    return `
export interface ${type.name} {
${properties}
}
`;
  }

  /**
   * 生成统一的客户端类
   */
  private generateUnifiedClientClass(operations: ParsedOperation[], options: GeneratorOptions): string {
    const className = this.generateClientClassName(options);
    
    return `
export class ${className} {
  private httpBuilder: HttpBuilder;

  constructor(httpBuilder: HttpBuilder) {
    this.httpBuilder = httpBuilder;
  }

${operations.map(op => this.generateApiMethod(op)).join('\n')}
}
`;
  }

  /**
   * 生成客户端类名
   */
  private generateClientClassName(options: GeneratorOptions): string {
    if (options.className) {
      return options.className;
    }
    
    if (options.projectName) {
      // 从项目名称生成客户端类名
      return this.projectNameToClassName(options.projectName);
    }
    
    // 默认类名
    return 'ApiClient';
  }

  /**
   * 将项目名称转换为客户端类名
   */
  private projectNameToClassName(projectName: string): string {
    // 处理常见的项目名称格式：kebab-case, snake_case, camelCase
    return projectName
      .split(/[-_]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('') + 'Client';
  }

  /**
   * 生成 API 类 (保留用于向后兼容)
   */
  private generateApiClass(api: ParsedAPI, options: GeneratorOptions): string {
    const className = options.className || api.className;
    
    return `
export class ${className}Api {
  private httpBuilder: HttpBuilder;

  constructor(httpBuilder: HttpBuilder) {
    this.httpBuilder = httpBuilder;
  }

${api.operations.map(op => this.generateApiMethod(op)).join('\n')}
}
`;
  }

  /**
   * 按 Controller 分组 API
   */
  private groupByController(apis: ParsedAPI[]): Map<string, ParsedAPI[]> {
    const groups = new Map<string, ParsedAPI[]>();
    
    for (const api of apis) {
      // 从操作中提取 Controller 名称
      for (const operation of api.operations) {
        const controllerName = this.extractControllerName(operation.name);
        if (!groups.has(controllerName)) {
          groups.set(controllerName, []);
        }
        
        // 为每个 Controller 创建独立的 API 对象
        let controllerApi = groups.get(controllerName)!.find(a => a.className === controllerName);
        if (!controllerApi) {
          controllerApi = {
            className: controllerName,
            operations: [],
            types: []  // 将在后面收集相关类型
          };
          groups.get(controllerName)!.push(controllerApi);
        }
        
        controllerApi.operations.push(operation);
      }
    }
    
    // 重新分配类型定义给相应的 Controller
    for (const api of apis) {
      for (const type of api.types) {
        // 根据类型名称找到对应的 Controller
        let assignedController = 'Common';
        for (const [controllerName] of groups) {
          if (type.name.toLowerCase().includes(controllerName.toLowerCase())) {
            assignedController = controllerName;
            break;
          }
        }
        
        const controllerApis = groups.get(assignedController);
        if (controllerApis && controllerApis[0]) {
          controllerApis[0].types.push(type);
        }
      }
    }
    
    return groups;
  }

  /**
   * 从操作名称提取 Controller 名称
   */
  private extractControllerName(operationName: string): string {
    // 严格按照 operationId 格式要求提取 Controller 名称
    if (!operationName) {
      throw new Error(`❌ operationName 为空，无法提取Controller名称`);
    }
    
    const match = operationName.match(/^([a-zA-Z]+?)(?:controller)?[_]([a-zA-Z]+)/i);
    if (!match) {
      throw new Error(`❌ operationName "${operationName}" 格式不正确。期望格式: "controllerName_methodName" 或 "controllerNameController_methodName"`);
    }
    
    // 转换为驼峰命名，去掉Controller后缀
    const controllerName = match[1].replace(/controller$/i, ''); // 去掉controller后缀
    return this.toPascalCase(controllerName).replace(/\d{8}/, ''); // 移除可能的日期信息
  }
  
  /**
   * 转换为PascalCase命名 - 直接使用change-case库
   */
  private toPascalCase(str: string): string {
    return pascalCase(str);
  }

  /**
   * 生成共享的基础类型和基类
   */
  private generateSharedApiTypes(): string {
    return `// 共享类型定义和基础 API 客户端

import { HttpBuilder, HttpMethod } from 'ts-sdk-client';

// API 配置接口
export interface APIConfig {
  uri: string;           // 请求 URI（每个方法都有默认值，可通过 withUri 覆盖）
  headers: Record<string, string>;  // 请求 headers（默认包含 Content-Type）
}

// 函数式选项类型
export type APIOption = (config: APIConfig) => void;

// 选项构造函数
export const withUri = (uri: string): APIOption => (config) => {
  config.uri = uri;
};

export const withHeaders = (headers: Record<string, string>): APIOption => (config) => {
  config.headers = { ...config.headers, ...headers };
};

export const withHeader = (key: string, value: string): APIOption => (config) => {
  config.headers = { ...config.headers, [key]: value };
};

// 组合选项
export const combineOptions = (...options: APIOption[]): APIOption => (config) => {
  options.forEach(option => option(config));
};

// 基础 API 客户端类
export abstract class APIClient {
  protected httpBuilder: HttpBuilder;

  constructor(httpBuilder: HttpBuilder) {
    this.httpBuilder = httpBuilder;
  }

  /**
   * 通用参数验证方法
   * @protected
   */
  protected validateRequest<T = unknown>(request: T): void {
    if (!request) {
      throw new Error('参数 request 是必需的');
    }
    
    if (typeof request !== 'object') {
      throw new Error('参数 request 必须是对象类型');
    }
  }

  /**
   * 通用请求处理方法
   * @protected
   */
  protected async executeRequest<TRequest = unknown, TResponse = unknown>(
    method: HttpMethod,
    path: string,
    request?: TRequest,
    options: APIOption[] = []
  ): Promise<TResponse> {
    // 创建默认配置
    const config: APIConfig = {
      uri: path,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    // 应用所有选项
    options.forEach(option => option(config));
    
    // 构建 HTTP 请求
    const httpBuilder = this.httpBuilder
      .setUri(config.uri)
      .setMethod(method);
    
    // 添加 headers
    Object.entries(config.headers).forEach(([key, value]) => {
      httpBuilder.addHeader(key, value);
    });
    
    // 添加请求体（如果有）
    if (request) {
      httpBuilder.setContent(JSON.stringify(request));
    }
    
    const http = httpBuilder.build();
    const [response, error] = await http.send();
    
    if (error) {
      throw error;
    }
    
    return JSON.parse(response);
  }
}
`;
  }

  /**
   * 生成单个 Controller 的 API 类
   */
  private generateControllerApi(controllerName: string, apis: ParsedAPI[], options: GeneratorOptions): string {
    const packageName = options.packageName || 'ts-sdk-client';
    const className = controllerName; // 直接使用controllerName，不拼接Api后缀
    
    let output = `import 'reflect-metadata';
import { HttpMethod } from '${packageName}';
import { APIClient, APIOption, APIConfig } from './types';
import { plainToClass, Type, Transform } from 'class-transformer';
import { IsString, IsNumber, IsBoolean, IsOptional, IsEmail, Min, Max, MinLength, MaxLength, Matches, validate } from 'class-validator';

export namespace ${className} {`;

    // 收集该 Controller 相关的类型定义（去重）
    const controllerTypes: Map<string, ParsedType> = new Map();
    const allOperations: ParsedOperation[] = [];
    
    for (const api of apis) {
      // 收集相关的类型定义
      for (const type of api.types) {
        if (type.name.toLowerCase().includes(controllerName.toLowerCase()) || 
            type.name === 'Error' || // 通用错误类型
            allOperations.some(op => op.requestType === type.name || op.responseType === type.name)) {
          // 使用 Map 去重
          controllerTypes.set(type.name, type);
        }
      }
      
      // 收集操作
      allOperations.push(...api.operations);
    }

    // 收集简化的类型定义，准备作为嵌套类
    const nestedTypes: any[] = [];
    const collectedTypeNames = new Set<string>();
    
    // 收集明确定义的类型
    if (controllerTypes.size > 0) {
      for (const [_, type] of controllerTypes) {
        // 移除前缀，使用简洁名称并转换为正确的驼峰格式
        const originalName = type.name.replace(new RegExp(`^${controllerName.toLowerCase()}controller`, 'i'), '')
                                      .replace(/^_/, ''); // 移除开头的下划线
        
        if (process.env.DEBUG) {
          console.log(`🔍 Type simplification: "${type.name}" -> "${originalName}" -> "${this.toPascalCase(originalName)}"`);
        }
        
        const simplifiedType = {
          ...type,
          name: this.toPascalCase(originalName)
        };
        nestedTypes.push(simplifiedType);
        collectedTypeNames.add(simplifiedType.name);
      }
    }
    
    // 收集所有操作使用的响应类型，为缺失的类型生成基础定义
    if (process.env.DEBUG) {
      console.log(`🔍 allOperations length: ${allOperations.length}`);
      console.log(`🔍 controllerName: ${controllerName}`);
    }
    
    for (const operation of allOperations) {
      const responseTypeName = operation.responseType ?
        this.getSimplifiedTypeName(operation.responseType, controllerName) : 
        this.getSimplifiedTypeName(this.generateDefaultResponseTypeName(operation), controllerName);
      
      if (process.env.DEBUG) {
        console.log(`🔍 Checking operation "${operation.name}": responseType="${operation.responseType}" -> simplified="${responseTypeName}"`);
      }
      
      if (!collectedTypeNames.has(responseTypeName)) {
        // 生成基础的响应类型定义
        const basicResponseType: ParsedType = {
          name: responseTypeName,
          description: `${operation.summary || operation.name} 响应类型`,
          properties: {
            data: {
              type: 'any',
              required: false,
              description: '响应数据'
            }
          }
        };
        nestedTypes.push(basicResponseType);
        collectedTypeNames.add(responseTypeName);
        
        if (process.env.DEBUG) {
          console.log(`🔍 Generated basic response type: "${responseTypeName}" for operation "${operation.name}"`);
        }
      } else {
        if (process.env.DEBUG) {
          console.log(`🔍 Response type "${responseTypeName}" already exists for operation "${operation.name}"`);
        }
      }
    }

    // 生成类型定义（直接在namespace内）
    if (nestedTypes.length > 0) {
      output += `\n`;
      for (const type of nestedTypes) {
        output += this.generateNamespaceInterface(type);
      }
    }

    // 不再生成独立的验证函数，Request类自带validate方法

    // 生成 Client 类，在namespace内
    output += `\n  /** ${className} 模块客户端 */
  export class Client extends APIClient {`;

    // 生成 API 方法
    for (const operation of allOperations) {
      output += this.generateNamespaceApiMethod(operation, controllerName, controllerTypes);
    }

    output += `
  }
}
`;

    return output;
  }

  /**
   * 生成带 options 的 API 方法 - 使用模板策略
   */
  private generateApiMethodWithOptions(operation: ParsedOperation, controllerName?: string, hasNamespace: boolean = true): string {
    const hasRequest = !!(operation.requestType && operation.requestType !== 'void');
    const methodName = operation.name.replace(/^.+?Controller_/, ''); // 移除 Controller 前缀
    
    // 使用嵌套类的类型名称
    const requestType = operation.requestType ? 
      this.getNestedTypeName(operation.requestType, controllerName, hasNamespace) : undefined;
    const responseType = operation.responseType ?
      this.getNestedTypeName(operation.responseType, controllerName, hasNamespace) : 
      this.getNestedTypeName(this.generateDefaultResponseTypeName(operation), controllerName, hasNamespace);
    
    // 生成验证代码（如果需要）
    const validationCode = hasRequest ? `    validate${operation.requestType?.replace(/[^a-zA-Z0-9]/g, '')}(request);` : '';
    
    return this.templateManager.generate('api-method', {
      operation: {
        ...operation,
        method: operation.method.toUpperCase(),
        requestType,
        responseType
      },
      methodName,
      hasRequest,
      validationCode
    });
  }

  /**
   * 获取namespace内的类型名称，如果没有复杂类型则返回基础类型
   */
  private getNestedTypeName(typeName: string, controllerName?: string, hasNamespace: boolean = true): string {
    if (!controllerName || !hasNamespace) {
      // 如果没有namespace，返回基础类型
      if (typeName?.toLowerCase().includes('response')) {
        return 'any'; // 或者返回基础的响应类型
      }
      return typeName;
    }
    
    // 多种格式的处理：
    // 1. "order_createorderRequest" -> "createorderRequest"
    // 2. "orderController_createorderRequest" -> "createorderRequest"
    // 3. "CreateorderRequest" -> "CreateorderRequest"（已简化的）
    
    let simplifiedName = typeName;
    
    // 移除各种可能的前缀模式
    simplifiedName = simplifiedName
      .replace(new RegExp(`^${controllerName.toLowerCase()}controller_`, 'i'), '') // ordercontroller_xxx
      .replace(new RegExp(`^${controllerName.toLowerCase()}_`, 'i'), '') // order_xxx  
      .replace(/^_/, ''); // 移除开头的下划线
    
    // 转换为PascalCase
    simplifiedName = this.toPascalCase(simplifiedName);
    
    if (process.env.DEBUG) {
      console.log(`🔍 getNestedTypeName: "${typeName}" -> "${controllerName}Types.${simplifiedName}"`);
    }
    
    return `${controllerName}Types.${simplifiedName}`;
  }


  /**
   * 在命名空间内生成接口定义 - 使用class-validator装饰器
   */
  private generateNamespaceInterface(type: ParsedType): string {
    const properties = Object.entries(type.properties)
      .map(([name, prop]: [string, any]) => {
        const decorators = this.generatePropertyDecorators(prop);
        const assertion = prop.required ? '!' : '?'; // 必需属性使用!断言，可选属性使用?
        const comment = prop.description ? ` // ${prop.description}` : '';
        
        return `${decorators}    ${name}${assertion}: ${prop.type};${comment}`;
      })
      .join('\n\n');

    // 为Request类添加validate方法
    const validateMethod = type.name.toLowerCase().includes('request') ? `

    /** 验证请求数据 */
    async validate(): Promise<void> {
      const errors = await validate(this);
      
      if (errors.length > 0) {
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {}).join(', ')
        ).join('; ');
        throw new Error(\`Validation failed: \${errorMessages}\`);
      }
    }` : '';

    return `  /** ${type.description || type.name + ' data type'} */
  export class ${type.name} {
${properties}${validateMethod}
  }

`;
  }

  /**
   * 基于OpenAPI属性生成class-validator装饰器
   */
  private generatePropertyDecorators(prop: TypeProperty): string {
    const decorators: string[] = [];

    // 基础类型装饰器
    switch (prop.type) {
      case 'string':
        decorators.push('    @IsString()');
        break;
      case 'number':
      case 'integer':
        decorators.push('    @IsNumber()');
        break;
      case 'boolean':
        decorators.push('    @IsBoolean()');
        break;
    }

    // 可选字段装饰器
    if (!prop.required) {
      decorators.push('    @IsOptional()');
    }

    // 格式验证装饰器
    if (prop.format === 'email') {
      decorators.push('    @IsEmail()');
    }

    // 数值范围装饰器
    if (prop.minimum !== undefined) {
      decorators.push(`    @Min(${prop.minimum})`);
    }
    if (prop.maximum !== undefined) {
      decorators.push(`    @Max(${prop.maximum})`);
    }

    // 字符串长度装饰器
    if (prop.minLength !== undefined || prop.maxLength !== undefined) {
      const min = prop.minLength || 0;
      const max = prop.maxLength || 10000;
      decorators.push(`    @MinLength(${min})`);
      decorators.push(`    @MaxLength(${max})`);
    }

    // 正则表达式装饰器
    if (prop.pattern) {
      decorators.push(`    @Matches(/${prop.pattern}/)`);
    }

    return decorators.length > 0 ? decorators.join('\n') + '\n' : '';
  }


  /**
   * 在命名空间内生成API方法
   */
  private generateNamespaceApiMethod(operation: ParsedOperation, controllerName?: string, controllerTypes?: Map<string, ParsedType>): string {
    // 简化方法名：ordercontroller_getorders -> getOrders
    const methodName = this.simplifyMethodName(operation.name);
    
    // 简化类型名，检查是否存在于controllerTypes中
    const requestType = operation.requestType ? 
      this.getSimplifiedTypeName(operation.requestType, controllerName) : undefined;
    const responseType = operation.responseType ?
      this.getSimplifiedTypeName(operation.responseType, controllerName) : 
      this.getSimplifiedTypeName(this.generateDefaultResponseTypeName(operation), controllerName);
      
    // 检查是否有复杂类型（需要使用简化名称检查）
    const simplifiedRequestName = operation.requestType ? 
      this.getSimplifiedTypeName(operation.requestType, controllerName) : undefined;
    const simplifiedResponseName = operation.responseType ?
      this.getSimplifiedTypeName(operation.responseType, controllerName) : undefined;
      
    const hasComplexRequestType = simplifiedRequestName && controllerTypes && 
      Array.from(controllerTypes.values()).some(type => type.name === simplifiedRequestName);
    const hasComplexResponseType = simplifiedResponseName && controllerTypes &&
      Array.from(controllerTypes.values()).some(type => type.name === simplifiedResponseName);
      
    if (process.env.DEBUG) {
      console.log(`🔍 Method ${methodName}: requestType="${operation.requestType}" -> "${simplifiedRequestName}", hasComplex=${hasComplexRequestType}`);
      console.log(`🔍 ControllerTypes keys: ${Array.from(controllerTypes?.keys() || []).join(', ')}`);
    }

    // 提取路径参数
    const pathParams = operation.parameters?.filter(p => p.in === 'path') || [];
    
    const hasRequest = !!(operation.requestType && operation.requestType !== 'void');
    const finalRequestType = hasRequest ? 
      (hasComplexRequestType ? requestType : 'any') : undefined;
    const finalResponseType = responseType; // 总是使用具体的响应类型，不回退到 any
    
    // 生成路径参数列表
    const pathParamsList = pathParams.map(p => `${p.name}: ${p.type}`).join(', ');
    const pathParamsPrefix = pathParamsList ? `${pathParamsList}, ` : '';
    
    const requestParam = hasRequest ? `request: ${finalRequestType}, ` : '';
    const requestArg = hasRequest ? 'request' : '{}';
    
    // 生成路径表达式（使用模板字符串）
    let pathExpression: string;
    if (pathParams.length > 0) {
      // 将 {param} 替换为 ${param}，生成模板字符串
      const templatePath = operation.path.replace(/\{([^}]+)\}/g, '${$1}');
      pathExpression = `\`${templatePath}\``;
    } else {
      pathExpression = `'${operation.path}'`;
    }
    
    // 生成验证函数调用（直接调用request.validate()）
    const validationCall = hasRequest && hasComplexRequestType ? 
      `      await request.validate();\n` : '';

    return `
    /** ${operation.summary || methodName} */
    async ${methodName}(${pathParamsPrefix}${requestParam}...options: APIOption[]): Promise<${finalResponseType}> {
${validationCall}
      return this.executeRequest<${finalRequestType || 'Record<string, never>'}, ${finalResponseType}>(
        HttpMethod.${operation.method.toUpperCase()},
        ${pathExpression},
        ${requestArg},
        options
      );
    }`;
  }

  /**
   * 生成默认响应类型名
   */
  private generateDefaultResponseTypeName(operation: ParsedOperation): string {
    const methodName = this.simplifyMethodName(operation.name);
    return `${this.toPascalCase(methodName)}Response`;
  }

  /**
   * 简化方法名：ordercontroller_getorders -> getOrders
   */
  private simplifyMethodName(operationName: string): string {
    // 移除控制器前缀
    let simplified = operationName.replace(/^.+?Controller_/i, '').replace(/^.+?controller_/i, '');
    
    // 转换为camelCase（首字母小写）
    return camelCase(simplified);
  }

  /**
   * 获取简化的类型名称：OrderCreateorderRequest -> CreateOrderRequest
   */
  private getSimplifiedTypeName(typeName: string, controllerName?: string): string {
    if (!controllerName) return 'any'; // 没有控制器名称时返回any
    
    const originalName = typeName
      .replace(new RegExp(`^${controllerName.toLowerCase()}controller_`, 'i'), '')
      .replace(new RegExp(`^${controllerName.toLowerCase()}_`, 'i'), '')
      .replace(/^_/, '');
    
    return this.toPascalCase(originalName);
  }


  /**
   * 生成详细的 JSDoc 注释
   */
  private generateJSDocComment(operation: ParsedOperation, methodName: string, hasRequest: boolean): string {
    const summary = operation.summary || operation.description || methodName;
    const requestParam = hasRequest ? 'request' : '';
    
    return `  /**
   * ${summary}
   * 
   * @description ${operation.description || '执行 ' + summary + ' 操作'}
   * @method ${operation.method.toUpperCase()}
   * @path ${operation.path}
   * ${hasRequest ? `@param {${operation.requestType}} request - 请求参数对象` : ''}
   * @param {...APIOption} options - 函数式选项参数
   * @returns {Promise<${operation.responseType}>} 返回 API 响应结果
   * 
   * @example
   * // 基本调用
   * const result = await api.${methodName}(${requestParam});
   * 
   * @example 
   * // 使用选项
   * const result = await api.${methodName}(${requestParam ? requestParam + ', ' : ''}
   *   withUri('/custom/path'),
   *   withHeader('X-Request-ID', 'unique-id'),
   *   withHeaders({ 'X-Custom': 'value' })
   * );
   * 
   * @throws {Error} 当请求失败或参数验证失败时抛出错误
   */`;
  }


  /**
   * 生成主入口文件
   */
  private generateIndexFile(controllerNames: string[]): string {
    let output = `// API 客户端主入口文件\n\n`;
    
    // 导出类型定义
    output += `export * from './types';\n\n`;
    
    // 导出所有 Controller
    for (const controllerName of controllerNames) {
      const fileName = controllerName.toLowerCase();
      const className = controllerName; // 不拼接Api后缀
      output += `export { ${className} } from './${fileName}';\n`;
    }
    
    output += `\n// 统一客户端类（向后兼容）
import { HttpBuilder } from 'ts-sdk-client';
`;
    
    // 导入所有 Controller 类
    for (const controllerName of controllerNames) {
      const className = controllerName; // 不拼接Api后缀
      output += `import { ${className} } from './${controllerName.toLowerCase()}';\n`;
    }
    
    output += `
export class Client {
`;
    
    // 创建各个 Controller 的实例
    for (const controllerName of controllerNames) {
      const propertyName = controllerName.toLowerCase();
      output += `  public readonly ${propertyName}: ${controllerName}.Client;\n`;
    }
    
    output += `

  constructor(httpBuilder: HttpBuilder) {`;
    
    // 初始化各个 Controller
    for (const controllerName of controllerNames) {
      const propertyName = controllerName.toLowerCase();
      output += `
    this.${propertyName} = new ${controllerName}.Client(httpBuilder);`;
    }
    
    output += `
  }
}
`;
    
    return output;
  }

  /**
   * 生成 API 方法（向后兼容）
   */
  private generateApiMethod(operation: ParsedOperation): string {
    return this.generateApiMethodWithOptions(operation);
  }

  /**
   * 生成使用示例
   */
  private generateUsageExamples(apis: ParsedAPI[], options: GeneratorOptions): string {
    const className = this.generateClientClassName(options);
    
    return `
/*
## 使用示例

### 1. 使用 Fetch 实现
\`\`\`typescript
import { FetchHttpBuilder } from 'ts-sdk-client';
import { ${className} } from './api';

const httpBuilder = new FetchHttpBuilder('https://api.example.com');
const client = new ${className}(httpBuilder);

// 调用 API 方法
const result = await client.getApiData({ id: '123' });
\`\`\`

### 2. 使用 Axios 实现
\`\`\`typescript
import axios from 'axios';
import { AxiosHttpBuilder } from 'ts-sdk-client';
import { ${className} } from './api';

const axiosInstance = axios.create({ timeout: 10000 });
const httpBuilder = new AxiosHttpBuilder('https://api.example.com', axiosInstance);
const client = new ${className}(httpBuilder);

// 调用 API 方法
const result = await client.getApiData({ id: '123' });
\`\`\`

### 3. 使用 Gateway 实现
\`\`\`typescript
import { createClient, HeaderBuilder } from 'gateway-ts-sdk';
import { GatewayHttpBuilder } from 'ts-sdk-client';
import { ${className} } from './api';

const gatewayClient = createClient('ws://localhost:18443', 'my-client');
const httpBuilder = new GatewayHttpBuilder('https://api.example.com', gatewayClient, HeaderBuilder);
const client = new ${className}(httpBuilder);

// 调用 API 方法
const result = await client.getApiData({ id: '123' });
\`\`\`
*/
`;
  }

  /**
   * 注册 Handlebars 辅助函数
   */
  private registerHelpers(): void {
    Handlebars.registerHelper('capitalize', (str: string) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    });

    Handlebars.registerHelper('lowercase', (str: string) => {
      return str.toLowerCase();
    });

    Handlebars.registerHelper('eq', (a: unknown, b: unknown) => {
      return a === b;
    });
  }

}

// 重新导出 ParsedAPI 相关类型
export * from './openapi-parser';
export * from './openapi-parser';