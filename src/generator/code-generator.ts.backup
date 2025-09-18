/**
 * 代码生成器 - 基于解析的 OpenAPI 数据生成 TypeScript 代码
 */

import { pascalCase, camelCase } from 'change-case';
import { createHash } from 'crypto';
import { APIGroup, TypeDefinition, APIOperation, TypeProperty } from './openapi-parser';

export interface GeneratorOptions {
  className?: string;
  packageName?: string;
  projectName?: string;
  sourceContent?: string; // 源文件内容，用于生成hash
}

export class CodeGenerator {
  constructor() {
    // 初始化代码生成器
  }

  /**
   * 生成 TypeScript SDK 代码
   *
   * @param apis - 解析后的 API 组数组
   * @param options - 生成选项配置
   * @returns Map<文件名, 文件内容> - 生成的多个 TypeScript 文件
   *
   * 生成策略:
   * 1. 生成 client.ts - 包含共享的基础类型和客户端基类
   * 2. 按 Controller 分组生成独立的 API 文件
   * 3. 每个 Controller 文件包含对应的类型定义和 API 方法
   */
  generate(apis: APIGroup[], options: GeneratorOptions): Map<string, string> {
    const files = new Map<string, string>();

    // 生成共享的基础类型和基类 (client.ts)
    const clientContent = this.generateSharedApiTypes();
    files.set('client.ts', clientContent);

    // 按 Controller 名称分组，为每个 Controller 生成独立的 API 文件
    const controllerGroups = this.groupByController(apis);
    
    for (const [controllerName, controllerApis] of controllerGroups) {
      const apiContent = this.generateControllerApi(controllerName, controllerApis, apis, options);
      files.set(`${controllerName.toLowerCase()}.ts`, apiContent); // 去掉.api后缀
    }
    
    // 生成主入口文件
    const indexContent = this.generateIndexFile(Array.from(controllerGroups.keys()));
    files.set('index.ts', indexContent);

    return files;
  }



  /**
   * 将 API 操作按 Controller 名称分组
   *
   * @param apis - API 组数组
   * @returns Map<Controller名称, APIGroup[]> - 按 Controller 分组的结果
   *
   * 分组逻辑:
   * 1. 遍历所有 API 组中的操作
   * 2. 从操作名称中提取 Controller 名称 (例: UserController_getUser -> UserController)
   * 3. 将相同 Controller 的操作归类到同一组
   */
  private groupByController(apis: APIGroup[]): Map<string, APIGroup[]> {
    const groups = new Map<string, APIGroup[]>();

    for (const api of apis) {
      // 处理有操作的API组
      if (api.operations.length > 0) {
        // 遍历 API 组中的所有操作，提取 Controller 名称
        for (const operation of api.operations) {
          const controllerName = this.extractControllerName(operation.name);
          if (!groups.has(controllerName)) {
            groups.set(controllerName, []);
          }
          
          // 为每个 Controller 创建独立的 API 对象
          const controllerGroup = groups.get(controllerName);
          if (controllerGroup) {
            let controllerApi = controllerGroup.find(a => a.className === controllerName);
            if (!controllerApi) {
              controllerApi = {
                className: controllerName,
                operations: [],
                types: []  // 将在后面收集相关类型
              };
              controllerGroup.push(controllerApi);
            }
            
            controllerApi.operations.push(operation);
          }
        }
      } else {
        // 处理没有操作的API组（如GlobalTypes），也要生成文件
        const controllerName = api.className;
        if (!groups.has(controllerName)) {
          groups.set(controllerName, []);
        }
        
        const controllerGroup = groups.get(controllerName);
        if (controllerGroup) {
          let controllerApi = controllerGroup.find(a => a.className === controllerName);
          if (!controllerApi) {
            controllerApi = {
              className: controllerName,
              operations: [], // 没有操作
              types: [] // 将在后面收集相关类型
            };
            controllerGroup.push(controllerApi);
          }
        }
      }
    }
    
    // 重新分配所有API组的类型定义给相应的 Controller
    for (const api of apis) {
      for (const type of api.types) {
        // 根据类型名称找到对应的 Controller
        let assignedController: string | null = null;
        for (const [controllerName] of groups) {
          if (type.name.toLowerCase().includes(controllerName.toLowerCase())) {
            assignedController = controllerName;
            break;
          }
        }
        
        // 只分配类型给已存在的Controller，避免创建不必要的Common Controller
        if (assignedController) {
          const controllerApis = groups.get(assignedController);
          if (controllerApis && controllerApis[0]) {
            controllerApis[0].types.push(type);
          }
        }
        // 如果找不到匹配的Controller，跳过这个类型
        // 它可能已经被其他Controller通过引用包含了
      }
    }
    
    return groups;
  }

  /**
   * 从操作名称中提取 Controller 名称
   *
   * @param operationName - 操作名称 (例: "UserController_getUser", "user_getProfile")
   * @returns 标准化的 Controller 名称 (例: "User")
   *
   * 提取规则:
   * 1. 支持格式: "ControllerName_methodName" 或 "ControllerNameController_methodName"
   * 2. 自动去除 "Controller" 后缀
   * 3. 转换为 PascalCase 格式
   * 4. 清理可能的日期信息
   */
  private extractControllerName(operationName: string): string {
    // 验证操作名称格式并提取 Controller 名称
    if (!operationName) {
      throw new Error(`operationName is empty, unable to extract Controller name`);
    }
    
    const match = operationName.match(/^([a-zA-Z]+?)(?:controller)?[_]([a-zA-Z]+)/i);
    if (!match) {
      throw new Error(`operationName "${operationName}" format is incorrect. Expected format: "controllerName_methodName" or "controllerNameController_methodName"`);
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

import { HttpBuilder, HttpMethod } from 'openapi-ts-sdk';
import { plainToClass, instanceToPlain, Type, Expose, Exclude } from 'class-transformer';

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
   * 通用请求处理方法 - 处理 HTTP 请求和响应的序列化/反序列化
   * @protected
   */
  protected async executeRequest<TRequest = unknown, TResponse = unknown>(
    method: HttpMethod,
    path: string,
    request: TRequest,
    responseType: {new(...args:any[]): TResponse},
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
    
    // 序列化请求体（如果有）
    if (request) {
      const requestJson = JSON.stringify(instanceToPlain(request));
      httpBuilder.setContent(requestJson);
    }
    
    const http = httpBuilder.build();
    const [response, error] = await http.send();
    
    if (error) {
      throw error;
    }
    
    if (response === "") {
      throw new Error("response is empty");
    }
    
    // 使用class-transformer进行反序列化
    const responseData = JSON.parse(response);
    const result = plainToClass(responseType, responseData);
    return result;
  }
}
`;
  }

  /**
   * 生成单个 Controller 的 API 类
   */
  private generateControllerApi(controllerName: string, apis: APIGroup[], allApis: APIGroup[], options: GeneratorOptions): string {
    const packageName = options.packageName || 'openapi-ts-sdk';
    const className = controllerName; // 直接使用controllerName，不拼接Api后缀
    
    // 生成源文件内容的hash
    const sourceHash = options.sourceContent ? 
      createHash('md5').update(options.sourceContent).digest('hex').substring(0, 8) : 
      'unknown';
    
    let output = `/**
 * Auto-generated by openapi-ts-sdk-cli. Do not edit manually!
 * 
 * Source hash: ${sourceHash}
 * Generator: openapi-ts-sdk-cli
 * Source: OpenAPI specification
 * 
 * To modify this file:
 * 1. Update the server-side OpenAPI specification
 * 2. Regenerate using openapi-ts-sdk-cli
 * 
 * Direct edits will be overwritten on next generation!
 */

import 'reflect-metadata';
import { HttpMethod } from 'openapi-ts-sdk';
import { APIClient, APIOption, APIConfig } from './client';
import { plainToClass, instanceToPlain, Type, Expose, Exclude } from 'class-transformer';
import { IsString, IsNumber, IsBoolean, IsOptional, IsEmail, Min, Max, MinLength, MaxLength, Matches, validate } from 'class-validator';

export namespace ${className} {`;

    // 先收集所有操作
    const allOperations: APIOperation[] = [];
    for (const api of apis) {
      allOperations.push(...api.operations);
    }
    
    // 收集该 Controller 相关的类型定义（去重）
    const controllerTypes: Map<string, TypeDefinition> = new Map();
    
    for (const api of apis) {
      // 收集相关的类型定义
      for (const type of api.types) {
        // 检查类型是否属于当前控制器  
        // 使用兜底策略：包含所有Request和Response类型
        const belongsToController = 
          type.name.toLowerCase().includes(controllerName.toLowerCase()) || 
          type.name === 'Error' || // 通用错误类型
          allOperations.some(op => op.requestType === type.name || op.responseType === type.name) ||
          // 兜底策略：包含所有Request和Response类型到每个控制器
          type.name.toLowerCase().includes('request') || type.name.toLowerCase().includes('response');
        
        if (belongsToController) {
          // 使用 Map 去重
          controllerTypes.set(type.name, type);
        }
      }
    }
    
    // 收集所有被引用的类型（包括间接引用）
    const referencedTypes = new Set<string>();
    const collectReferencedTypes = (type: TypeDefinition) => {
      for (const [_, prop] of Object.entries(type.properties)) {
        // 检查属性类型是否引用了其他类型
        if (prop.type.includes('[]')) {
          const baseType = prop.type.replace('[]', '');
          if (baseType !== 'string' && baseType !== 'number' && baseType !== 'boolean' && !baseType.startsWith('Record<')) {
            referencedTypes.add(baseType);
          }
        } else if (prop.type !== 'string' && prop.type !== 'number' && prop.type !== 'boolean' && !prop.type.startsWith('Record<')) {
          referencedTypes.add(prop.type);
        }
      }
    };
    
    // 收集所有已定义类型的引用
    for (const [_, type] of controllerTypes) {
      collectReferencedTypes(type);
    }
    
    // 添加被引用的类型定义 - 从所有API组中查找
    for (const apiGroup of apis) {
      for (const type of apiGroup.types) {
        if (referencedTypes.has(type.name)) {
          controllerTypes.set(type.name, type);
        }
      }
    }
    
    // 如果还有未找到的引用类型，尝试从全局类型中查找
    const allGlobalTypes = new Map<string, TypeDefinition>();
    for (const apiGroup of allApis) {
      for (const type of apiGroup.types) {
        allGlobalTypes.set(type.name, type);
      }
    }
    
    // 只添加被当前控制器引用的全局类型，而不是所有全局类型
    for (const referencedType of referencedTypes) {
      if (!controllerTypes.has(referencedType) && allGlobalTypes.has(referencedType)) {
        controllerTypes.set(referencedType, allGlobalTypes.get(referencedType)!);
      }
    }

    // 收集简化的类型定义，准备作为嵌套类
    const nestedTypes: any[] = [];
    const collectedTypeNames = new Set<string>();
    
    // 收集明确定义的类型并创建类型名映射
    const typeNameMapping = new Map<string, string>();
    
    if (controllerTypes.size > 0) {
      for (const [_, type] of controllerTypes) {
        // 简化类型名称：移除控制器前缀
        let simplifiedName = type.name;
        
        // 移除控制器名前缀（如果存在）
        const controllerPrefix = this.toPascalCase(controllerName);
        if (simplifiedName.startsWith(controllerPrefix)) {
          simplifiedName = simplifiedName.substring(controllerPrefix.length);
        }
        
        // 确保是PascalCase
        simplifiedName = this.toPascalCase(simplifiedName);
        
        // 记录类型名映射
        typeNameMapping.set(type.name, simplifiedName);
        
        const simplifiedType = {
          ...type,
          name: simplifiedName
        };
        nestedTypes.push(simplifiedType);
        collectedTypeNames.add(simplifiedName);
      }
    }
    
    // 更新所有类型中的类型引用
    for (const type of nestedTypes) {
      for (const [propName, prop] of Object.entries(type.properties)) {
        // 更新属性类型引用
        const typedProp = prop as any;
        if (typedProp.type && typedProp.type.includes('[]')) {
          const baseType = typedProp.type.replace('[]', '');
          if (typeNameMapping.has(baseType)) {
            typedProp.type = typeNameMapping.get(baseType)! + '[]';
          }
        } else if (typedProp.type && typeNameMapping.has(typedProp.type)) {
          typedProp.type = typeNameMapping.get(typedProp.type)!;
        }
      }
    }
    
    // 收集所有操作使用的类型，为缺失的类型生成基础定义
    
    for (const operation of allOperations) {
      // 处理Response类型 - 统一使用基于方法名生成的类型名
      const responseTypeName = this.getSimpleName(this.generateDefaultResponseTypeName(operation), controllerName);
      
      if (!collectedTypeNames.has(responseTypeName)) {
        // 生成基础的响应类型定义
        const basicResponseType: TypeDefinition = {
          name: responseTypeName,
          description: `${operation.summary || operation.name} 响应类型`,
          properties: {
            data: {
              type: 'unknown',
              required: false,
              description: '响应数据'
            }
          }
        };
        nestedTypes.push(basicResponseType);
        collectedTypeNames.add(responseTypeName);
      }
      
      // 处理Request类型 - 使用新的方法名生成
      // 统一使用基于方法名生成的Request类型名
      const requestTypeName = this.getSimpleName(this.generateDefaultRequestTypeName(operation), controllerName);
      
      if (!collectedTypeNames.has(requestTypeName)) {
        const basicRequestType: TypeDefinition = {
          name: requestTypeName,
          description: `${operation.summary || operation.name} 请求类型`,
          properties: {}
        };
        (basicRequestType as any).isMissingRequestType = true;
        (basicRequestType as any).operationInfo = {
          operationId: operation.name,
          method: operation.method?.toUpperCase(),
          path: operation.path,
          summary: operation.summary
        };
        nestedTypes.push(basicRequestType);
        collectedTypeNames.add(requestTypeName);
      }
      
      {
        // 如果没有requestType，生成默认的Request类型
        const defaultRequestTypeName = this.getSimpleName(this.generateDefaultRequestTypeName(operation), controllerName);
        
        if (!collectedTypeNames.has(defaultRequestTypeName)) {
          const basicRequestType: TypeDefinition = {
            name: defaultRequestTypeName,
            description: `${operation.summary || operation.name} 请求类型`,
            properties: {
              // 属性定义将在后续的接口生成中补充
            }
          };
          
          // 标记为缺失的请求类型，用于后续特殊处理
          (basicRequestType as any).isMissingRequestType = true;
          // 保存操作信息，用于生成更详细的文档注释
          (basicRequestType as any).operationInfo = {
            operationId: operation.name,
            method: operation.method?.toUpperCase(),
            path: operation.path,
            summary: operation.summary
          };
          
          nestedTypes.push(basicRequestType);
          collectedTypeNames.add(defaultRequestTypeName);
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
      output += this.generateApiMethodWithOptions(operation, controllerName, true);
    }

    output += `
  }
}
`;

    return output;
  }

  /**
   * 生成带 options 的 API 方法 - 直接调用executeRequest
   */
  private generateApiMethodWithOptions(operation: APIOperation, controllerName?: string, hasNamespace: boolean = true): string {
    const hasRequest = !!(operation.requestType && operation.requestType !== 'void');
    // 移除控制器前缀，只保留方法名
    // 例如: analyticshandler_getsegmentedreport -> getsegmentedreport
    // 基于路径生成更准确的方法名
    const methodName = this.generateMethodNameFromPath(operation);
    
    // 使用嵌套类的类型名称（带namespace前缀，用于类型声明）
    // 统一使用基于方法名生成的类型名，确保一致性
    const requestType = this.getNestedTypeName(this.generateDefaultRequestTypeName(operation), controllerName, hasNamespace);
    const responseType = this.getNestedTypeName(this.generateDefaultResponseTypeName(operation), controllerName, hasNamespace);
      
    // 类型名称处理在executeRequest调用中直接完成
    
    // 提取路径参数
    const pathParams = (operation.parameters || []).filter(p => p && p.in === 'path');
    
    
    // 生成路径参数列表
    const pathParamsList = pathParams.map(p => `${p.name}: ${p.type}`).join(', ');
    const pathParamsPrefix = pathParamsList ? `${pathParamsList}, ` : '';
    
    // 生成路径表达式（使用模板字符串）
    let pathExpression: string;
    if (pathParams.length > 0) {
      // 将 {param} 替换为 ${param}，生成模板字符串
      const templatePath = operation.path.replace(/\{([^}]+)\}/g, '${$1}');
      pathExpression = `\`${templatePath}\``;
    } else {
      pathExpression = `'${operation.path}'`;
    }
    
    // 生成参数列表
    const requestParam = hasRequest ? `request: ${requestType}, ` : '';
    const requestArg = hasRequest ? 'request' : `new ${requestType.includes('.') ? requestType.split('.')[1] : requestType}()`;
    
    // 生成验证代码（如果需要）
    const validationCode = hasRequest ? `      await request.validate();\n` : '';
    
    return `  /**
   * ${operation.summary || methodName}
   * 
   * @description Execute ${operation.summary || methodName} operation
   * @method ${operation.method.toUpperCase()}
   * @path ${operation.path}
   * 
   * ${pathParams.map(p => `@param {${p.type}} ${p.name} - Path parameter`).join('\n   * ')}${pathParams.length > 0 ? '\n   * ' : ''}${hasRequest ? `@param {${requestType.includes('.') ? requestType.split('.')[1] : requestType}} request - Request parameters\n   * ` : ''}@param {...APIOption} options - Functional option parameters
   * @returns {Promise<${responseType.includes('.') ? responseType.split('.')[1] : responseType}>} Returns API response result
   * 
   * @example
   * const result = await api.${methodName}(${pathParams.map(p => p.name).join(', ')}${pathParams.length > 0 && hasRequest ? ', ' : ''}${hasRequest ? 'request' : ''});
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async ${methodName}(${pathParamsPrefix}${requestParam}...options: APIOption[]): Promise<${responseType.includes('.') ? responseType.split('.')[1] : responseType}> {
${validationCode}
    return this.executeRequest<${requestType.includes('.') ? requestType.split('.')[1] : requestType}, ${responseType.includes('.') ? responseType.split('.')[1] : responseType}>(
      HttpMethod.${operation.method.toUpperCase()},
      ${pathExpression},
      ${requestArg},
      ${responseType.includes('.') ? responseType.split('.')[1] : responseType},
      options
    );
  }

`;
  }

  /**
   * 转义正则表达式特殊字符
   */
  private escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * 获取namespace内的类型名称，如果没有复杂类型则返回基础类型
   */
  /**
   * 获取namespace内的类型名称，如果没有复杂类型则返回基础类型
   */
  private getNestedTypeName(typeName: string, controllerName?: string, hasNamespace: boolean = true): string {
    if (!controllerName || !hasNamespace) {
      // 如果没有namespace，返回基础类型
      return typeName;
    }
    
    // 移除类型名称中的控制器前缀
    // 例如: "AnalyticshandlerGetsegmentedreportResponse" -> "GetsegmentedreportResponse"
    let simplifiedName = typeName;
    
    // 移除控制器名称前缀（不区分大小写）
    const controllerPrefix = this.toPascalCase(controllerName);
    if (simplifiedName.startsWith(controllerPrefix)) {
      simplifiedName = simplifiedName.substring(controllerPrefix.length);
    }
    
    // 确保是PascalCase
    simplifiedName = this.toPascalCase(simplifiedName);
    
    // 返回namespace形式
    return `${controllerPrefix}.${simplifiedName}`;
  }



  /**
   * 在命名空间内生成接口定义 - 使用class-validator装饰器
   */
  private generateNamespaceInterface(type: TypeDefinition): string {
    // 检查是否为缺失的Request类型
    const isMissingRequest = (type as any).isMissingRequestType;
    const operationInfo = (type as any).operationInfo;
    
    if (isMissingRequest && operationInfo) {
      // 为缺失的Request类型生成详细的文档注释，包含缺失原因和解决方案
      return `  /** 
   * ${type.description || type.name + ' data type'}
   * 
   * Note: This request type definition is incomplete
   * 
   * Missing reason:
   * • The requestBody definition for ${operationInfo.method} ${operationInfo.path} operation in OpenAPI specification is incomplete
   * • May lack specific schema definition or property description
   * 
     * For server-side developers to improve:
     * 1. Complete @ApiBody() decorator in Controller
     * 2. Add complete DTO class definition and use @ApiProperty() decorator
     * 3. Ensure OpenAPI specification includes detailed requestBody.content.application/json.schema
     * 4. Regenerate OpenAPI specification documentation
     * 
     * Server-side improvement example:
     * \`\`\`typescript
     * @ApiBody({ type: ${type.name} })
     * async ${operationInfo.operationId?.split('_')[1] || 'methodName'}(@Body() request: ${type.name}) {
     *   // Implementation logic
     * }
     * \`\`\`
     * 
     * For client developers:
     * • This type is temporarily an empty object, please use according to actual API documentation
     * • After server-side improvement, regenerate SDK to get complete type definition
   */
  export class ${type.name} {
    // 注意: 需要根据具体API需求添加属性定义
    // 可以参考 ${operationInfo.operationId} 的API文档或服务端DTO定义

    /** 验证请求数据 */
    async validate(): Promise<void> {
      const errors = await validate(this);
      
      if (errors.length > 0) {
        const errorDetails = errors.map(error => {
          const property = error.property || 'unknown';
          const constraints = error.constraints || {};
          const constraintMessages = Object.values(constraints).join(', ');
          const value = error.value !== undefined ? JSON.stringify(error.value) : 'undefined';
          return \`属性 '\${property}' 验证失败: \${constraintMessages} (当前值: \${value})\`;
        }).join('\\n');
        
        throw new Error(\`Request data validation failed:\\n\${errorDetails}\\n\\nPlease check the following:\\n1. Ensure all required fields are provided\\n2. Check if field types are correct (string/number/array etc.)\\n3. Verify field formats meet requirements\\n4. If the problem persists, please contact server-side developers to check API specification\`);
      }
    }
  }

`;
    }
    
    // 正常的类型定义
    const properties = Object.entries(type.properties)
      .map(([name, prop]) => {
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
        const errorDetails = errors.map(error => {
          const property = error.property || 'unknown';
          const constraints = error.constraints || {};
          const constraintMessages = Object.values(constraints).join(', ');
          const value = error.value !== undefined ? JSON.stringify(error.value) : 'undefined';
          return \`属性 '\${property}' 验证失败: \${constraintMessages} (当前值: \${value})\`;
        }).join('\\n');
        
        throw new Error(\`Request data validation failed:\\n\${errorDetails}\\n\\nPlease check the following:\\n1. Ensure all required fields are provided\\n2. Check if field types are correct (string/number/array etc.)\\n3. Verify field formats meet requirements\\n4. If the problem persists, please contact server-side developers to check API specification\`);
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
  private generatePropertyDecorators(prop: TypeProperty, typeNameMapping?: Map<string, string>): string {
    const decorators: string[] = [];

    // 检查是否为数组类型
    if (prop.type.endsWith('[]')) {
      // 数组类型需要特殊处理
      const itemType = prop.type.slice(0, -2); // 移除 '[]' 后缀

      // 只有复杂对象数组才需要 ClassArray，基础类型数组不需要
      if (this.isComplexType(itemType)) {
        // 复杂类型数组（如 User[]、Msg[]）使用 @Type 装饰器
        const mappedType = typeNameMapping?.get(itemType) || itemType;
        decorators.push(`    @Type(() => ${mappedType})`);
      }
      // 基础类型数组（string[]、number[]、boolean[]）和内置类型不需要特殊装饰器

      // 可选字段装饰器（根据 required 字段）
      if (!prop.required) {
        decorators.push('    @IsOptional()');
      }

      return decorators.length > 0 ? decorators.join('\n') + '\n' : '';
    }

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
   * 判断是否为复杂类型（需要使用 ClassArray 的类型）
   */
  private isComplexType(type: string): boolean {
    // 基础类型不需要 ClassArray
    const primitiveTypes = [
      'string', 'number', 'boolean', 'integer',
      'object', 'any', 'unknown', 'void', 'null', 'undefined'
    ];

    // TypeScript 内置类型不需要 ClassArray
    const builtinTypes = [
      'Date', 'RegExp', 'Error', 'Map', 'Set', 'WeakMap', 'WeakSet',
      'Array', 'Promise', 'Function', 'Object', 'Record'
    ];

    // 泛型类型通常不需要 ClassArray
    if (type.includes('<') || type.includes('>')) {
      return false;
    }

    // 联合类型不需要 ClassArray
    if (type.includes('|')) {
      return false;
    }

    // 检查是否为基础类型或内置类型
    if (primitiveTypes.includes(type.toLowerCase()) || builtinTypes.includes(type)) {
      return false;
    }

    // 首字母大写的类型名，且不在排除列表中，认为是复杂的自定义类型
    return /^[A-Z][a-zA-Z0-9]*$/.test(type);
  }


  /**
   * 在命名空间内生成API方法
   */
  private generateNamespaceApiMethod(operation: APIOperation, controllerName?: string, controllerTypes?: Map<string, TypeDefinition>): string {
    // 生成智能方法名：基于路径和HTTP方法
    const methodName = this.generateIntelligentMethodName(operation);
    
    // 简化类型名，检查是否存在于controllerTypes中
    const requestType = operation.requestType ? 
      this.getSimpleName(operation.requestType, controllerName) : undefined;
    const responseType = operation.responseType ?
      this.getSimpleName(operation.responseType, controllerName) : 
      this.getSimpleName(this.generateDefaultResponseTypeName(operation), controllerName);
      
    // 检查是否有复杂类型（需要使用简化名称检查）
    const simplifiedRequestName = operation.requestType ? 
      this.getSimpleName(operation.requestType, controllerName) : undefined;
    const simplifiedResponseName = operation.responseType ?
      this.getSimpleName(operation.responseType, controllerName) : undefined;
      
    const hasComplexRequestType = simplifiedRequestName && controllerTypes && 
      Array.from(controllerTypes.values()).some(type => type.name === simplifiedRequestName);
    const hasComplexResponseType = simplifiedResponseName && controllerTypes &&
      Array.from(controllerTypes.values()).some(type => type.name === simplifiedResponseName);
      

    // 提取路径参数
    const pathParams = (operation.parameters || []).filter(p => p && p.in === 'path');
    
    const hasRequest = !!(operation.requestType && operation.requestType !== 'void');
    const finalRequestType = hasRequest ? 
      (hasComplexRequestType ? requestType : 'any') : undefined;
    const finalResponseType = responseType; // 总是使用具体的响应类型，不回退到 any
    
    // 生成路径参数列表
    const pathParamsList = pathParams.map(p => `${p.name}: ${p.type}`).join(', ');
    const pathParamsPrefix = pathParamsList ? `${pathParamsList}, ` : '';
    
    const requestParam = hasRequest ? `request: ${finalRequestType}, ` : '';
    const requestArg = hasRequest ? 'request' : `new ${finalRequestType}()`;
    
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
        ${finalResponseType},
        options
      );
    }`;
  }

  /**
   * 生成默认响应类型名
   */
  private generateDefaultResponseTypeName(operation: APIOperation): string {
    const methodName = this.generateMethodNameFromPath(operation);
    return `${this.toPascalCase(methodName)}Response`;
  }

  /**
   * 生成默认请求类型名
   */
  private generateDefaultRequestTypeName(operation: APIOperation): string {
    const methodName = this.generateMethodNameFromPath(operation);
    return `${this.toPascalCase(methodName)}Request`;
  }

  /**
   * 简化方法名：基于operationId和路径智能生成方法名
   */
  private simplifyMethodName(operationName: string): string {
    // 移除控制器前缀
    let simplified = operationName.replace(/^.+?Controller_/i, '').replace(/^.+?controller_/i, '');
    
    // 转换为camelCase（首字母小写）
    return camelCase(simplified);
  }

  /**
   * 基于路径和HTTP方法生成智能的方法名
   */
  private generateIntelligentMethodName(operation: APIOperation): string {
    if (!operation.path || !operation.method) {
      return this.simplifyMethodName(operation.name);
    }

    // 直接实现路径解析逻辑，避免动态导入
    try {
      const httpMethod = operation.method.toLowerCase();
      const pathSegments = operation.path.split('/').filter(Boolean);
      
      // 分析路径结构
      const params = pathSegments.filter(seg => seg.includes('{'));
      const versionSegment = pathSegments.find(seg => /^v\d+$/i.test(seg));
      const versionPrefix = versionSegment ? versionSegment.toUpperCase() : null;
      const pathAnalysis = {
        paramCount: params.length,
        versionPrefix
      };
      
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
        default:
          methodName = httpMethod;
      }
      
      return camelCase(methodName);
    } catch (error) {
      // 如果出错，回退到原始逻辑
      return this.simplifyMethodName(operation.name);
    }
  }

  /**
   * 生成GET方法名 - 基于URI结构，便于识别对应路径，包含版本信息
   */
  private generateGetMethodName(analysis: any, pathSegments: string[]): string {
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
  private generatePostMethodName(analysis: any, pathSegments: string[]): string {
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
  private generatePutMethodName(analysis: any, pathSegments: string[]): string {
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
  private generatePatchMethodName(analysis: any, pathSegments: string[]): string {
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
  private generateDeleteMethodName(analysis: any, pathSegments: string[]): string {
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
   * 基于路径生成方法名
   */
  private generateMethodNameFromPath(operation: APIOperation): string {
    const path = operation.path;
    const method = operation.method?.toLowerCase() || 'get';
    
    // 移除路径参数 {param}，保留路径结构
    const cleanPath = path.replace(/\{[^}]+\}/g, '');
    
    // 移除开头的 /api/ 等前缀，并分割成单词
    const pathSegments = cleanPath.split('/').filter(seg => 
      seg && !['api', 'v1', 'v2'].includes(seg.toLowerCase())
    );
    
    // 将每个路径段分割成单词（处理驼峰、下划线、连字符）
    const words: string[] = [];
    pathSegments.forEach(segment => {
      // 处理驼峰命名：systemId -> system, Id
      const camelWords = segment.replace(/([a-z])([A-Z])/g, '$1 $2');
      // 处理下划线和连字符
      const splitWords = camelWords.split(/[-_]/);
      // 转换为小写并过滤空字符串
      words.push(...splitWords.map(w => w.toLowerCase()).filter(w => w));
    });
    
    // 生成方法名：HTTP方法 + 路径单词
    const methodPrefix = method === 'get' ? 'get' : 
                        method === 'post' ? 'create' :
                        method === 'put' ? 'update' :
                        method === 'delete' ? 'delete' :
                        method === 'patch' ? 'patch' : method;
    
    // 组合成驼峰命名
    const pathName = words.map((word, index) => 
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
    
    let methodName = `${methodPrefix}${pathName.charAt(0).toUpperCase()}${pathName.slice(1)}`;
    
    // 处理重复方法名：如果有路径参数，添加By参数名
    const pathParams = (operation.parameters || []).filter(p => p && p.in === 'path');
    if (pathParams.length > 0) {
      const paramNames = pathParams.map(p => p.name.charAt(0).toUpperCase() + p.name.slice(1)).join('');
      methodName = `${methodPrefix}${pathName.charAt(0).toUpperCase()}${pathName.slice(1)}By${paramNames}`;
    }
    
    return methodName;
  }

  /**
   * 获取简化的类型名称（用于多处调用）
   */
  private getSimpleName(typeName: string, controllerName?: string): string {
    if (!controllerName) return typeName;
    
    const controllerPrefix = this.toPascalCase(controllerName);
    let simplifiedName = typeName;
    
    if (simplifiedName.startsWith(controllerPrefix)) {
      simplifiedName = simplifiedName.substring(controllerPrefix.length);
    }
    
    return this.toPascalCase(simplifiedName);
  }

  /**
   * 生成主入口文件
   */
  private generateIndexFile(controllerNames: string[]): string {
    let output = `// API 客户端主入口文件\n\n`;
    
    // 导出类型定义
    output += `export * from './src/client';\n\n`;
    
    // 导出所有 Controller
    for (const controllerName of controllerNames) {
      const fileName = controllerName.toLowerCase();
      const className = controllerName; // 不拼接Api后缀
      output += `export { ${className} } from './src/${fileName}';\n`;
    }
    
    output += `\n
import { HttpBuilder } from 'openapi-ts-sdk';
`;
    
    // 导入所有 Controller 类
    for (const controllerName of controllerNames) {
      const className = controllerName; // 不拼接Api后缀
      output += `import { ${className} } from './src/${controllerName.toLowerCase()}';\n`;
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
  private generateApiMethod(operation: APIOperation): string {
    return this.generateApiMethodWithOptions(operation);
  }
}

// 重新导出 API 相关类型
export * from './openapi-parser';