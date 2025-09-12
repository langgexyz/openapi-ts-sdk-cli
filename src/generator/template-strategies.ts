/**
 * 基于策略模式的模板系统 - 解决硬编码模板问题
 */

import { APIOperation, TypeDefinition } from './openapi-parser';
import { Json, ClassArray } from 'ts-json';

/**
 * 模板策略接口
 */
export interface TemplateStrategy {
  /**
   * 策略名称
   */
  name: string;
  
  /**
   * 生成模板内容
   */
  generate(data: Record<string, unknown>): string;
}

/**
 * 抽象模板策略基类
 */
export abstract class AbstractTemplateStrategy implements TemplateStrategy {
  abstract name: string;
  abstract generate(data: any): string;

  /**
   * 通用的导入语句生成
   */
  protected generateImports(packageName: string): string {
    return `import { 
  HttpBuilder, 
  HttpMethod,
  APIOption,
  withUri,
  withHeader, 
  withHeaders,
} from '${packageName}';

`;
  }

  /**
   * 通用的JSDoc注释生成
   */
  protected generateJSDoc(operation: APIOperation, methodName: string, hasRequest: boolean): string {
    const summary = operation.summary || operation.description || methodName;
    const requestParam = hasRequest ? 'request' : '';
    
    return `  /**
   * ${summary}
   * 
   * @description ${operation.description || 'Execute ' + summary + ' operation'}
   * @method ${operation.method.toUpperCase()}
   * @path ${operation.path}
   * ${hasRequest ? `@param {${operation.requestType}} request - Request parameters object` : ''}
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<${operation.responseType}>} Returns API response result
   * 
   * @example
   * const result = await api.${methodName}(${requestParam ? requestParam.replace(', ', '') : ''});
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */`;
  }
}

/**
 * API方法模板策略
 */
export class ApiMethodTemplateStrategy extends AbstractTemplateStrategy {
  name = 'api-method';

  generate(data: {
    operation: APIOperation;
    methodName: string;
    hasRequest: boolean;
    validationCode: string;
  }): string {
    const { operation, methodName, hasRequest, validationCode } = data;
    
    const requestParam = hasRequest ? `request: ${operation.requestType}, ` : '';
    const requestArg = hasRequest ? 'request' : 'undefined';
    
    return `${this.generateJSDoc(operation, methodName, hasRequest)}
  async ${methodName}(${requestParam}...options: APIOption[]): Promise<${operation.responseType}> {
${validationCode}
    
    // 应用函数式选项
    let builder = this.httpBuilder
      .setMethod('${operation.method.toUpperCase()}' as HttpMethod)
      .setUri('${operation.path}');
    
    if (${requestArg} !== undefined) {
      builder = builder.setContent(new Json().toJson(${requestArg}));
    }
    
    // 创建API配置对象
    const config: APIConfig = {
      uri: '${operation.path}',
      headers: { 'Content-Type': 'application/json' }
    };
    
    // 应用函数式选项
    for (const option of options) {
      option(config);
    }
    
    // 更新builder的配置
    builder = builder.setUri(config.uri);
    
    // 设置headers
    for (const [key, value] of Object.entries(config.headers)) {
      builder = builder.addHeader(key, value as string);
    }
    
    const http = builder.build();
    const [response, error] = await http.send();
    
    if (error) {
      throw error;
    }
    
      try {
        // 如果有具体的响应类型，使用 ts-json 反序列化
        ${operation.responseType && operation.responseType !== 'any' ? `
        const ResponseClass = ${operation.responseType.split('.').pop()};
        // 检查是否是数组类型（响应类型名包含Array或以[]结尾）
        const isArrayResponse = '${operation.responseType}'.includes('Array') || '${operation.responseType}'.endsWith('[]');
        if (isArrayResponse) {
          // 对于数组类型，直接使用ClassArray作为prototype
          const [result, error] = new Json().fromJson(response, new ClassArray(ResponseClass));
          if (error) throw error;
          return result;
        } else {
          // 对于普通类型，使用类的实例作为prototype  
          const [result, error] = new Json().fromJson(response, new ResponseClass());
          if (error) throw error;
          return result;
        }` : `
        return JSON.parse(response);`}
      } catch {
        return response as any;
      }
  }
`;
  }
}

/**
 * API控制器类模板策略
 */
export class ApiControllerTemplateStrategy extends AbstractTemplateStrategy {
  name = 'api-controller';

  generate(data: {
    className: string;
    methods: string[];
    packageName: string;
  }): string {
    const { className, methods, packageName } = data;
    
    return `${this.generateImports(packageName)}
/**
 * ${className} - API client class
 * 
 * This class provides all API methods related to ${className}
 * Uses HttpBuilder for underlying HTTP communication
 */
export class ${className} {
  private httpBuilder: HttpBuilder;

  constructor(httpBuilder: HttpBuilder) {
    this.httpBuilder = httpBuilder;
  }

${methods.join('\n')}
}
`;
  }
}

/**
 * 类型接口模板策略
 */
export class TypeInterfaceTemplateStrategy extends AbstractTemplateStrategy {
  name = 'type-interface';

  generate(data: { type: TypeDefinition; namespace?: string }): string {
    const { type, namespace } = data;
    
    const properties = Object.entries(type.properties)
      .map(([name, prop]: [string, any]) => {
        const optional = prop.required ? '' : '?';
        const comment = prop.description ? ` // ${prop.description}` : '';
        const visibility = 'public '; // class 需要声明可见性
        return `  ${visibility}${name}${optional}: ${prop.type};${comment}`;
      })
      .join('\n');

    const constructor = Object.keys(type.properties).length > 0 ? `
  constructor(data: Partial<${type.name}> = {}) {
${Object.keys(type.properties).map(name => `    this.${name} = data.${name};`).join('\n')}
  }` : '';

    return `
/**
 * ${type.description || type.name + ' data type'}
 */
export class ${type.name} {
${properties}${constructor}
}
`;
  }
}

/**
 * 索引文件模板策略
 */
export class IndexFileTemplateStrategy extends AbstractTemplateStrategy {
  name = 'index-file';

  generate(data: { controllerNames: string[] }): string {
    const { controllerNames } = data;
    
    const imports = controllerNames
      .map(name => `import { ${name} } from './${name.toLowerCase()}';`)
      .join('\n');
    
    const exports = controllerNames
      .map(name => `export { ${name} } from './${name.toLowerCase()}';`)
      .join('\n');
    
    const properties = controllerNames
      .map(name => `  public readonly ${name.toLowerCase()}: ${name};`)
      .join('\n');
    
    const constructorAssignments = controllerNames
      .map(name => `    this.${name.toLowerCase()} = new ${name}(httpBuilder);`)
      .join('\n');

    return `// 导出所有API类型和工具
export * from './types';
export {
  HttpBuilder,
  AxiosHttpBuilder,
  FetchHttpBuilder,
  GatewayHttpBuilder,
  APIOption,
  withUri,
  withHeader,
  withHeaders,
} from 'openapi-ts-sdk';

// 导出所有API类
${exports}

${imports}

/**
 * Unified API client - aggregates all controllers
 * 
 * This class provides a unified entry point for accessing all API controllers
 * 
 * @example
 * import { AxiosHttpBuilder } from 'openapi-ts-sdk/axios';
 * import { ApiClient } from './index';
 * 
 * const httpBuilder = new AxiosHttpBuilder({ baseURL: 'https://api.example.com' });
 * const client = new ApiClient(httpBuilder);
 * 
 * // Use different controllers
 * const users = await client.user.getList();
 * const orders = await client.order.getById({ id: '123' });
 */
export class ApiClient {
${properties}

  constructor(httpBuilder: HttpBuilder) {
${constructorAssignments}
  }
}
`;
  }
}

/**
 * 包配置文件模板策略
 */
export class PackageJsonTemplateStrategy extends AbstractTemplateStrategy {
  name = 'package-json';

  generate(data: {
    projectName: string;
    sdkClientPath: string;
  }): string {
    const { projectName, sdkClientPath } = data;
    
    return JSON.stringify({
      "name": projectName,
      "version": "1.0.0",
      "description": "Generated TypeScript SDK client",
      "main": "index.js",
      "types": "index.d.ts",
      "scripts": {
        "build": "tsc",
        "dev": "tsc --watch",
        "test": "jest"
      },
      "dependencies": {
        "openapi-ts-sdk": `file:${sdkClientPath}`,
        "class-transformer": "^0.5.1",
        "class-validator": "^0.14.0", 
        "reflect-metadata": "^0.1.13"
      },
      "devDependencies": {
        "typescript": "^5.0.0",
        "@types/node": "^20.0.0"
      },
      "keywords": ["sdk", "typescript", "api-client"],
      "license": "MIT"
    }, null, 2);
  }
}

/**
 * TypeScript配置模板策略
 */
export class TsConfigTemplateStrategy extends AbstractTemplateStrategy {
  name = 'tsconfig';

  generate(data: {}): string {
    return JSON.stringify({
      "compilerOptions": {
        "target": "ES2020",
        "module": "commonjs",
        "lib": ["ES2020"],
        "declaration": true,
        "outDir": "./dist",
        "rootDir": "./",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
      },
      "include": [
        "**/*.ts"
      ],
      "exclude": [
        "node_modules",
        "dist"
      ]
    }, null, 2);
  }
}

/**
 * 模板策略管理器
 */
export class TemplateStrategyManager {
  private strategies = new Map<string, TemplateStrategy>();

  constructor() {
    // 注册默认策略
    this.registerStrategy(new ApiMethodTemplateStrategy());
    this.registerStrategy(new ApiControllerTemplateStrategy());
    this.registerStrategy(new TypeInterfaceTemplateStrategy());
    this.registerStrategy(new IndexFileTemplateStrategy());
    this.registerStrategy(new PackageJsonTemplateStrategy());
    this.registerStrategy(new TsConfigTemplateStrategy());
  }

  /**
   * 注册模板策略
   */
  registerStrategy(strategy: TemplateStrategy): void {
    this.strategies.set(strategy.name, strategy);
  }

  /**
   * 生成模板内容
   */
  generate(templateName: string, data: any): string {
    const strategy = this.strategies.get(templateName);
    if (!strategy) {
      throw new Error(`Unknown template strategy: ${templateName}`);
    }
    return strategy.generate(data);
  }

  /**
   * 获取所有可用的模板策略名称
   */
  getAvailableTemplates(): string[] {
    return Array.from(this.strategies.keys());
  }
}
