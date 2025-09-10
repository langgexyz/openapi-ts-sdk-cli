/**
 * 集成测试 - 测试完整的工作流程
 */

import { OpenAPIParser } from '../src/generator/openapi-parser';
import { CodeGenerator } from '../src/generator/code-generator';
import * as fs from 'fs';
import * as path from 'path';

describe('Integration Tests', () => {
  let parser: OpenAPIParser;
  let generator: CodeGenerator;
  const testOutputDir = './test-output';

  beforeAll(() => {
    parser = new OpenAPIParser();
    generator = new CodeGenerator();
    
    // 创建测试输出目录
    if (!fs.existsSync(testOutputDir)) {
      fs.mkdirSync(testOutputDir, { recursive: true });
    }
  });

  afterAll(() => {
    // 清理测试输出目录
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  describe('完整工作流程测试', () => {
    test('应该能够解析 OpenAPI 并生成完整的 TypeScript 代码', async () => {
      const mockSpec = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            get: {
              operationId: 'getUsers',
              tags: ['User'],
              responses: {
                '200': {
                  description: 'Success',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            name: { type: 'string' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            post: {
              operationId: 'createUser',
              tags: ['User'],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        email: { type: 'string' }
                      },
                      required: ['name', 'email']
                    }
                  }
                }
              },
              responses: {
                '201': {
                  description: 'Created',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          name: { type: 'string' },
                          email: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };

      // 解析 OpenAPI
      const apis = parser.parse(mockSpec);
      expect(apis).toBeDefined();
      expect(apis.length).toBeGreaterThan(0);

      // 生成代码
      const files = generator.generate(apis, {
        packageName: 'test-integration-sdk',
        projectName: 'Integration Test'
      });

      expect(files).toBeDefined();
      expect(files.size).toBeGreaterThan(0);

      // 检查关键文件
      expect(files.has('types.ts')).toBeTruthy();
      expect(files.has('index.ts')).toBeTruthy();

      // 检查生成的内容
      const typesContent = files.get('types.ts')!;
      expect(typesContent).toContain('ApiConfig');
      expect(typesContent).toContain('APIClient');
      expect(typesContent).toContain('withUri');

      const indexContent = files.get('index.ts')!;
      expect(indexContent).toContain('export');
      expect(indexContent).toContain('UnifiedApiClient');

      // 将文件写入磁盘用于手动检查
      for (const [fileName, content] of files.entries()) {
        const filePath = path.join(testOutputDir, fileName);
        fs.writeFileSync(filePath, content, 'utf8');
      }

      console.log(`✅ 生成了 ${files.size} 个文件到 ${testOutputDir}`);
    });

    test('应该处理复杂的 OpenAPI 规范', async () => {
      const complexSpec = {
        openapi: '3.0.0',
        info: { title: 'Complex API', version: '2.0.0' },
        paths: {
          '/users/{id}': {
            get: {
              operationId: 'getUserById',
              tags: ['User'],
              parameters: [
                {
                  name: 'id',
                  in: 'path' as const,
                  required: true,
                  schema: { type: 'integer' }
                },
                {
                  name: 'include',
                  in: 'query' as const,
                  required: false,
                  schema: { type: 'string' }
                }
              ],
              responses: {
                '200': { description: 'User found' },
                '404': { description: 'User not found' }
              }
            }
          },
          '/posts': {
            get: {
              operationId: 'getPosts',
              tags: ['Post'],
              responses: { '200': { description: 'Posts list' } }
            },
            post: {
              operationId: 'createPost',
              tags: ['Post'],
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        title: { type: 'string' },
                        content: { type: 'string' },
                        tags: {
                          type: 'array',
                          items: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              },
              responses: { '201': { description: 'Post created' } }
            }
          }
        }
      };

      const apis = parser.parse(complexSpec);
      expect(apis.length).toBeGreaterThanOrEqual(2); // User 和 Post

      const files = generator.generate(apis, { packageName: 'complex-sdk' });
      expect(files.size).toBeGreaterThan(2); // 至少 types.ts, index.ts, 和一些 API 文件

      // 验证生成的文件包含预期的内容
      let hasUserOperations = false;
      let hasPostOperations = false;

      for (const content of files.values()) {
        if (content.includes('getUserById') || content.includes('User')) {
          hasUserOperations = true;
        }
        if (content.includes('getPosts') || content.includes('createPost') || content.includes('Post')) {
          hasPostOperations = true;
        }
      }

      expect(hasUserOperations).toBeTruthy();
      expect(hasPostOperations).toBeTruthy();
    });
  });

  describe('错误处理测试', () => {
    test('应该优雅处理无效的 OpenAPI 规范', () => {
      const invalidSpec = {
        // 缺少必要字段
        invalid: true
      };

      expect(() => {
        parser.parse(invalidSpec as any);
      }).toThrow();
    });

    test('应该处理空的 paths', () => {
      const emptySpec = {
        openapi: '3.0.0',
        info: { title: 'Empty API', version: '1.0.0' },
        paths: {}
      };

      const apis = parser.parse(emptySpec);
      expect(apis).toEqual([]);

      const files = generator.generate(apis, { packageName: 'empty-sdk' });
      expect(files.has('types.ts')).toBeTruthy();
      expect(files.has('index.ts')).toBeTruthy();
    });
  });

  describe('代码质量验证', () => {
    test('生成的 TypeScript 代码应该是有效的', async () => {
      const spec = {
        openapi: '3.0.0',
        info: { title: 'Quality Test API', version: '1.0.0' },
        paths: {
          '/test': {
            get: {
              operationId: 'test',
              responses: { '200': { description: 'OK' } }
            } as any
          }
        }
      };

      const apis = parser.parse(spec);
      const files = generator.generate(apis, { packageName: 'quality-test' });

      // 检查生成的代码不包含明显的语法错误标记
      for (const [fileName, content] of files.entries()) {
        // 不应该包含 undefined 或 null 引用
        expect(content).not.toContain('undefined.');
        expect(content).not.toContain('null.');
        
        // 应该有正确的导入语句
        if (fileName.endsWith('.ts')) {
          expect(content).toMatch(/^(\/\/.*\n)*\s*(import.*from.*|export.*)/m);
        }
        
        // 不应该有未闭合的括号（简单检查）
        const openBraces = (content.match(/\{/g) || []).length;
        const closeBraces = (content.match(/\}/g) || []).length;
        expect(openBraces).toBe(closeBraces);
      }
    });
  });
});
