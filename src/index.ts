/**
 * TypeScript SDK Client Generator - 主入口文件
 * 从 OpenAPI 规范生成基于 ts-sdk-client 的 TypeScript API 客户端
 */

// 导出核心生成器
export * from './generator/openapi-parser';
export * from './generator/code-generator';

// 版本信息
export const VERSION = '1.0.0';

// 默认导出生成器类
import { OpenAPIParser, OpenAPISpec } from './generator/openapi-parser';
import { CodeGenerator } from './generator/code-generator';

export { OpenAPIParser, CodeGenerator };

// 便捷函数
import { GeneratorOptions } from './generator/code-generator';

export async function generateFromSpec(spec: OpenAPISpec, options: GeneratorOptions): Promise<Map<string, string>> {
  const parser = new OpenAPIParser();
  const generator = new CodeGenerator();
  
  const apis = parser.parse(spec);
  return generator.generate(apis, options);
}