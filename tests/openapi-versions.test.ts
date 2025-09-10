/**
 * 测试不同 OpenAPI 版本的支持
 */

import { OpenAPIParser } from '../src/generator/openapi-parser';
import { CodeGenerator } from '../src/generator/code-generator';

// OpenAPI 2.0 (Swagger) 规范示例
const openAPI2Spec: any = {
  swagger: '2.0',
  info: {
    title: 'Test API v2',
    version: '1.0.0'
  },
  host: 'api.example.com',
  basePath: '/v1',
  schemes: ['https'],
  paths: {
    '/users': {
      get: {
        operationId: 'getUsers',
        summary: 'Get users',
        tags: ['Users'],
        responses: {
          '200': {
            description: 'Success',
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
  }
};

// OpenAPI 3.0 规范示例
const openAPI3Spec: any = {
  openapi: '3.0.3',
  info: {
    title: 'Test API v3',
    version: '1.0.0'
  },
  servers: [
    { url: 'https://api.example.com/v1' }
  ],
  paths: {
    '/users': {
      get: {
        operationId: 'getUsers',
        summary: 'Get users',
        tags: ['Users'],
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
                      name: { type: 'string' },
                      email: { type: 'string', format: 'email' }
                    }
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

// OpenAPI 3.1 规范示例
const openAPI31Spec: any = {
  openapi: '3.1.0',
  info: {
    title: 'Test API v3.1',
    version: '1.0.0'
  },
  servers: [
    { url: 'https://api.example.com/v1' }
  ],
  paths: {
    '/users': {
      get: {
        operationId: 'getUsers',
        summary: 'Get users',
        tags: ['Users'],
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
                      name: { type: 'string' },
                      email: { type: 'string', format: 'email' }
                    },
                    required: ['id', 'name']
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

// 包含边缘情况的复杂 OpenAPI 3.0 规范
const complexOpenAPISpec: any = {
  openapi: '3.0.3',
  info: {
    title: 'Complex Test API',
    version: '1.0.0'
  },
  paths: {
    '/users/{id}': {
      get: {
        operationId: 'getUserById',
        summary: 'Get user by ID',
        tags: ['Users'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' }
          },
          {
            name: 'include',
            in: 'query',
            required: false,
            schema: { type: 'string', enum: ['profile', 'settings'] }
          }
        ],
        responses: {
          '200': {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    name: { type: 'string' },
                    profile: {
                      type: 'object',
                      properties: {
                        bio: { type: 'string' },
                        avatar: { type: 'string', format: 'uri' }
                      }
                    }
                  },
                  required: ['id', 'name']
                }
              }
            }
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    code: { type: 'integer' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/files/upload': {
      post: {
        operationId: 'uploadFile',
        summary: 'Upload file',
        tags: ['Files'],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: { type: 'string', format: 'binary' },
                  metadata: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Success' }
        }
      }
    }
  }
};

async function testOpenAPIVersion(name: string, spec: any, expectedVersion: string): Promise<boolean> {
  console.log(`\n🧪 测试 ${name}...`);
  
  try {
    const parser = new OpenAPIParser();
    const apis = parser.parse(spec);
    
    console.log(`✅ ${name} 解析成功`);
    console.log(`   - API 分组数量: ${apis.length}`);
    
    if (apis.length > 0) {
      console.log(`   - 操作数量: ${apis.reduce((sum, api) => sum + api.operations.length, 0)}`);
      console.log(`   - 类型定义数量: ${apis.reduce((sum, api) => sum + api.types.length, 0)}`);
    }
    
    // 测试代码生成
    const generator = new CodeGenerator();
    const files = generator.generate(apis, {
      packageName: 'test-sdk',
      projectName: `test-${name.toLowerCase().replace(/\s+/g, '-')}`
    });
    
    console.log(`   - 生成文件数量: ${files.size}`);
    
    // 验证生成的代码包含必要内容
    const hasTypes = Array.from(files.values()).some(content => content.includes('export interface'));
    const hasClasses = Array.from(files.values()).some(content => content.includes('export class'));
    const hasMethods = Array.from(files.values()).some(content => content.includes('async '));
    
    console.log(`   - 包含类型定义: ${hasTypes ? '✅' : '❌'}`);
    console.log(`   - 包含 API 类: ${hasClasses ? '✅' : '❌'}`);
    console.log(`   - 包含异步方法: ${hasMethods ? '✅' : '❌'}`);
    
    return true;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`❌ ${name} 测试失败: ${errorMessage}`);
    if (process.env.DEBUG && error instanceof Error) {
      console.error(error.stack);
    }
    return false;
  }
}

async function testEdgeCases(): Promise<boolean> {
  console.log(`\n🧪 测试边缘情况...`);
  
  const testCases = [
    {
      name: '空 paths',
      spec: { openapi: '3.0.0', info: { title: 'Empty', version: '1.0.0' }, paths: {} as any }
    },
    {
      name: '无 operationId',
      spec: {
        openapi: '3.0.0',
        info: { title: 'No OperationId', version: '1.0.0' },
        paths: {
          '/test': {
            get: {
              summary: 'Test without operationId',
              responses: { '200': { description: 'OK' } }
            }
          }
        }
      }
    },
    {
      name: '复杂嵌套类型',
      spec: {
        openapi: '3.0.0',
        info: { title: 'Complex Types', version: '1.0.0' },
        paths: {
          '/complex': {
            post: {
              operationId: 'complexOperation',
              requestBody: {
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        nested: {
                          type: 'object',
                          properties: {
                            array: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  value: { type: 'string' }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              responses: { '200': { description: 'OK' } }
            }
          }
        }
      }
    }
  ];
  
  let passed = 0;
  
  for (const testCase of testCases) {
    try {
      const parser = new OpenAPIParser();
      const apis = parser.parse(testCase.spec);
      
      const generator = new CodeGenerator();
      const files = generator.generate(apis, { packageName: 'test-edge-case' });
      
      console.log(`✅ ${testCase.name}: 通过`);
      passed++;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`❌ ${testCase.name}: ${errorMessage}`);
    }
  }
  
  console.log(`\n边缘情况测试结果: ${passed}/${testCases.length} 通过`);
  return passed === testCases.length;
}

async function main(): Promise<void> {
  console.log('🧪 OpenAPI 版本兼容性测试开始...\n');
  
  const results = [];
  
  // 测试不同版本
  results.push(await testOpenAPIVersion('OpenAPI 2.0 (Swagger)', openAPI2Spec, '2.0'));
  results.push(await testOpenAPIVersion('OpenAPI 3.0', openAPI3Spec, '3.0'));
  results.push(await testOpenAPIVersion('OpenAPI 3.1', openAPI31Spec, '3.1'));
  results.push(await testOpenAPIVersion('复杂 OpenAPI 3.0', complexOpenAPISpec, '3.0'));
  
  // 测试边缘情况
  results.push(await testEdgeCases());
  
  // 总结结果
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  console.log(`\n📊 测试总结:`);
  console.log(`===============================`);
  console.log(`通过: ${passed}/${total}`);
  console.log(`成功率: ${Math.round((passed / total) * 100)}%`);
  
  if (passed === total) {
    console.log('\n🎉 所有 OpenAPI 版本测试通过！');
    process.exit(0);
  } else {
    console.log('\n❌ 部分测试失败，需要修复');
    process.exit(1);
  }
}

// 如果直接运行此文件
if (require.main === module) {
  main().catch(console.error);
}

export {
  testOpenAPIVersion,
  testEdgeCases,
  openAPI2Spec,
  openAPI3Spec,
  openAPI31Spec,
  complexOpenAPISpec
};
