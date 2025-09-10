/**
 * 代码生成器 - 基于解析的 OpenAPI 数据生成 TypeScript 代码
 */

import Handlebars from 'handlebars';
import { ParsedAPI, ParsedType, ParsedOperation, TypeProperty } from './openapi-parser';

export interface GeneratorOptions {
  className?: string;
  packageName?: string;
  projectName?: string;
}

export class CodeGenerator {
  constructor() {
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
      files.set(`${controllerName.toLowerCase()}.api.ts`, apiContent);
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
      // 从项目名称生成客户端类名，例如 "dexx-bigVCall" -> "DexxBigVCallClient"
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
    // 如果操作名包含 Controller 信息，提取它
    const match = operationName.match(/^(.+?)Controller[_]/);
    if (match) {
      return match[1].replace(/\d{8}/, ''); // 移除日期信息
    }
    
    // 尝试从操作名直接提取 controller 前缀
    const directMatch = operationName.match(/^([A-Z][a-zA-Z]*?)_/);
    if (directMatch) {
      return directMatch[1];
    }
    
    // 默认分组
    return 'Common';
  }

  /**
   * 生成共享的基础类型和基类
   */
  private generateSharedApiTypes(): string {
    return `// 共享类型定义和基础 API 客户端

import { HttpBuilder, HttpMethod } from 'ts-sdk-client';

// API 配置接口
export interface ApiConfig {
  uri: string;           // 请求 URI（每个方法都有默认值，可通过 withUri 覆盖）
  headers: Record<string, string>;  // 请求 headers（默认包含 Content-Type）
}

// 函数式选项类型
export type ApiOption = (config: ApiConfig) => void;

// 选项构造函数
export const withUri = (uri: string): ApiOption => (config) => {
  config.uri = uri;
};

export const withHeaders = (headers: Record<string, string>): ApiOption => (config) => {
  config.headers = { ...config.headers, ...headers };
};

export const withHeader = (key: string, value: string): ApiOption => (config) => {
  config.headers = { ...config.headers, [key]: value };
};

// 组合选项
export const combineOptions = (...options: ApiOption[]): ApiOption => (config) => {
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
    options: ApiOption[] = []
  ): Promise<TResponse> {
    // 创建默认配置
    const config: ApiConfig = {
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
    const className = `${controllerName}Api`;
    
    let output = `import { HttpMethod } from '${packageName}';
import { APIClient, ApiOption } from './types';

`;

    // 收集该 Controller 相关的类型定义
    const controllerTypes: ParsedType[] = [];
    const allOperations: ParsedOperation[] = [];
    
    for (const api of apis) {
      // 收集相关的类型定义
      for (const type of api.types) {
        if (type.name.toLowerCase().includes(controllerName.toLowerCase()) || 
            type.name === 'Error' || // 通用错误类型
            allOperations.some(op => op.requestType === type.name || op.responseType === type.name)) {
          controllerTypes.push(type);
        }
      }
      
      // 收集操作
      allOperations.push(...api.operations);
    }

    // 生成该 Controller 的类型定义
    if (controllerTypes.length > 0) {
      output += `// ${className} 相关类型定义\n`;
      for (const type of controllerTypes) {
        output += this.generateTypeInterface(type);
      }
      output += '\n';
    }

    // 生成验证函数
    const requestTypes = new Set<string>();
    for (const operation of allOperations) {
      if (operation.requestType) {
        requestTypes.add(operation.requestType);
      }
    }

    if (requestTypes.size > 0) {
      output += `// 验证函数\n`;
      for (const requestType of requestTypes) {
        output += this.generateValidationFunction(requestType, controllerTypes);
      }
      output += '\n';
    }

    // 生成 API 类，继承 APIClient
    output += `export class ${className} extends APIClient {

`;

    // 生成 API 方法
    for (const operation of allOperations) {
      output += this.generateApiMethodWithOptions(operation);
    }

    output += `}
`;

    return output;
  }

  /**
   * 生成带 options 的 API 方法
   */
  private generateApiMethodWithOptions(operation: ParsedOperation): string {
    const hasRequest = !!(operation.requestType && operation.requestType !== 'void');
    const methodName = operation.name.replace(/^.+?Controller_/, ''); // 移除 Controller 前缀
    
    let params = '';
    if (hasRequest) {
      params += `request: ${operation.requestType}`;
      params += ', ';
    }
    params += '...options: ApiOption[]';

    // 生成详细的 JSDoc 注释
    const jsdocComment = this.generateJSDocComment(operation, methodName, hasRequest);
    
    return `
${jsdocComment}
  async ${methodName}(${params}): Promise<${operation.responseType || 'unknown'}> {
    ${hasRequest ? `validate${operation.requestType}(request);` : '// 无需参数验证'}
    
    return this.executeRequest<${hasRequest ? operation.requestType || 'unknown' : 'undefined'}, ${operation.responseType || 'unknown'}>(
      HttpMethod.${operation.method},
      '${operation.path}',
      ${hasRequest ? 'request' : 'undefined'},
      options
    );
  }`;
  }

  /**
   * 生成验证函数
   */
  private generateValidationFunction(requestType: string, controllerTypes: ParsedType[]): string {
    // 找到对应的类型定义
    const typeDefinition = controllerTypes.find(type => type.name === requestType);
    if (!typeDefinition) {
      return `function validate${requestType}(request: ${requestType}): void {
  if (!request) {
    throw new Error('参数 request 是必需的');
  }
  if (typeof request !== 'object') {
    throw new Error('参数 request 必须是对象类型');
  }
}

`;
    }

    let validationCode = `function validate${requestType}(request: ${requestType}): void {
  if (!request) {
    throw new Error('参数 request 是必需的');
  }
  if (typeof request !== 'object') {
    throw new Error('参数 request 必须是对象类型');
  }

`;

    // 根据字段类型生成验证逻辑
    for (const [propName, property] of Object.entries(typeDefinition.properties)) {
      const propType = property.type;
      const isRequired = property.required;

      if (isRequired) {
        // 必填字段验证
        validationCode += `  if (request.${propName} === undefined || request.${propName} === null) {
    throw new Error('字段 ${propName} 是必需的');
  }
`;
      }

      // 类型验证
      if (propType === 'string') {
        validationCode += `  if (request.${propName} !== undefined && typeof request.${propName} !== 'string') {
    throw new Error('字段 ${propName} 必须是字符串类型');
  }
`;
        
        // 特殊字段验证
        if (propName.toLowerCase().includes('address') || propName.toLowerCase().includes('caaddress')) {
          validationCode += `  if (request.${propName} && !/^0x[a-fA-F0-9]{40}$/.test(request.${propName})) {
    console.warn('字段 ${propName} 格式可能不正确，期望 0x 开头的 40 位十六进制字符');
  }
`;
        }
      } else if (propType === 'number') {
        validationCode += `  if (request.${propName} !== undefined && typeof request.${propName} !== 'number') {
    throw new Error('字段 ${propName} 必须是数字类型');
  }
`;
        
        // 特殊字段验证
        if (propName.toLowerCase() === 'pagesize') {
          validationCode += `  if (request.${propName} !== undefined && (request.${propName} <= 0 || request.${propName} > 1000)) {
    throw new Error('字段 ${propName} 必须在 1-1000 之间');
  }
`;
        } else if (propName.toLowerCase() === 'pagenum') {
          validationCode += `  if (request.${propName} !== undefined && request.${propName} < 1) {
    throw new Error('字段 ${propName} 必须大于等于 1');
  }
`;
        }
      } else if (propType === 'boolean') {
        validationCode += `  if (request.${propName} !== undefined && typeof request.${propName} !== 'boolean') {
    throw new Error('字段 ${propName} 必须是布尔类型');
  }
`;
      }
    }

    validationCode += `}

`;
    return validationCode;
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
   * @param {...ApiOption} options - 函数式选项参数
   * @returns {Promise<${operation.responseType || 'unknown'}>} 返回 API 响应结果
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
    
    // 导出所有 Controller API
    for (const controllerName of controllerNames) {
      const fileName = controllerName.toLowerCase();
      const className = `${controllerName}Api`;
      output += `export { ${className} } from './${fileName}.api';\n`;
    }
    
    output += `\n// 统一客户端类（向后兼容）
import { HttpBuilder } from 'ts-sdk-client';
`;
    
    // 导入所有 API 类
    for (const controllerName of controllerNames) {
      const className = `${controllerName}Api`;
      output += `import { ${className} } from './${controllerName.toLowerCase()}.api';\n`;
    }
    
    output += `
export class UnifiedApiClient {
  private httpBuilder: HttpBuilder;
`;
    
    // 创建各个 Controller 的实例
    for (const controllerName of controllerNames) {
      const className = `${controllerName}Api`;
      const propertyName = controllerName.toLowerCase();
      output += `  public readonly ${propertyName}: ${className};\n`;
    }
    
    output += `
  constructor(httpBuilder: HttpBuilder) {
    this.httpBuilder = httpBuilder;
`;
    
    // 初始化各个 Controller
    for (const controllerName of controllerNames) {
      const className = `${controllerName}Api`;
      const propertyName = controllerName.toLowerCase();
      output += `    this.${propertyName} = new ${className}(httpBuilder);\n`;
    }
    
    output += `  }
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
const result = await client.searchTimeline({ caAddress: '0x...' });
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
const result = await client.searchTimeline({ caAddress: '0x...' });
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
const result = await client.searchTimeline({ caAddress: '0x...' });
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