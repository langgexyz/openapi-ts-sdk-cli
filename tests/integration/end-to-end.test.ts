/**
 * 端到端集成测试
 * 测试完整的代码生成流程
 */

import { OpenAPIParser } from '../../src/generator/openapi-parser';
import { CodeGenerator } from '../../src/generator/code-generator';
import { OpenAPIV3 } from 'openapi-types';
import * as fs from 'fs';
import * as path from 'path';

describe('End-to-End Integration Tests', () => {
  let parser: OpenAPIParser;
  let generator: CodeGenerator;
  const testOutputDir = path.join(__dirname, '../fixtures/test-output');

  beforeEach(() => {
    parser = new OpenAPIParser();
    generator = new CodeGenerator();
    
    // 确保输出目录存在
    if (!fs.existsSync(testOutputDir)) {
      fs.mkdirSync(testOutputDir, { recursive: true });
    }
  });

  afterEach(() => {
    // 清理测试文件
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true, force: true });
    }
  });

  describe('完整的生成流程', () => {
    it('应该从 OpenAPI 规范生成完整的 TypeScript 客户端', async () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { 
          title: 'Integration Test API', 
          version: '1.0.0',
          description: 'API for integration testing'
        },
        servers: [{ url: 'http://localhost:3000' }],
        tags: [
          { name: 'users', description: '用户管理' },
          { name: 'orders', description: '订单管理' }
        ],
        paths: {
          '/api/v1/users': {
            get: {
              tags: ['users'],
              operationId: 'userController_getUsers',
              summary: '获取用户列表',
              description: '获取所有用户的列表',
              responses: {
                '200': {
                  description: '成功返回用户列表',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          users: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'string', description: '用户ID' },
                                name: { type: 'string', description: '用户名' },
                                email: { type: 'string', format: 'email', description: '邮箱' },
                                age: { type: 'number', minimum: 0, maximum: 150, description: '年龄' }
                              },
                              required: ['id', 'name', 'email']
                            }
                          },
                          total: { type: 'number', description: '总数' },
                          page: { type: 'number', description: '当前页' },
                          pageSize: { type: 'number', description: '页大小' }
                        },
                        required: ['users', 'total']
                      }
                    }
                  }
                }
              }
            },
            post: {
              tags: ['users'],
              operationId: 'userController_createUser',
              summary: '创建用户',
              description: '创建新用户',
              requestBody: {
                required: true,
                description: '用户创建请求',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        name: { 
                          type: 'string', 
                          minLength: 2,
                          maxLength: 50,
                          description: '用户名'
                        },
                        email: { 
                          type: 'string', 
                          format: 'email',
                          description: '邮箱地址'
                        },
                        age: { 
                          type: 'number',
                          minimum: 0,
                          maximum: 150,
                          description: '年龄'
                        },
                        preferences: {
                          type: 'object',
                          properties: {
                            theme: { type: 'string', enum: ['light', 'dark'] },
                            language: { type: 'string', default: 'zh-CN' }
                          }
                        }
                      },
                      required: ['name', 'email']
                    }
                  }
                }
              },
              responses: {
                '200': {
                  description: '用户创建成功',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', description: '新创建的用户ID' },
                          message: { type: 'string', description: '成功消息' },
                          user: {
                            type: 'object',
                            properties: {
                              id: { type: 'string' },
                              name: { type: 'string' },
                              email: { type: 'string' }
                            }
                          }
                        },
                        required: ['id', 'message']
                      }
                    }
                  }
                }
              }
            }
          },
          '/api/v1/users/{id}': {
            get: {
              tags: ['users'],
              operationId: 'userController_getUserById',
              summary: '获取用户详情',
              parameters: [
                {
                  name: 'id',
                  in: 'path',
                  required: true,
                  description: '用户ID',
                  schema: { type: 'string' }
                }
              ],
              responses: {
                '200': {
                  description: '成功返回用户详情',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          user: {
                            type: 'object',
                            properties: {
                              id: { type: 'string' },
                              name: { type: 'string' },
                              email: { type: 'string' },
                              age: { type: 'number' },
                              createdAt: { type: 'string', format: 'date-time' },
                              updatedAt: { type: 'string', format: 'date-time' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            put: {
              tags: ['users'],
              operationId: 'userController_updateUser',
              summary: '更新用户',
              parameters: [
                {
                  name: 'id',
                  in: 'path',
                  required: true,
                  schema: { type: 'string' }
                }
              ],
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        age: { type: 'number' }
                      }
                    }
                  }
                }
              },
              responses: {
                '200': {
                  description: '更新成功',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          success: { type: 'boolean' },
                          message: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '/api/v2/orders/{orderId}/status': {
            get: {
              tags: ['orders'],
              operationId: 'orderController_getOrderStatus',
              summary: '获取订单状态',
              parameters: [
                {
                  name: 'orderId',
                  in: 'path',
                  required: true,
                  schema: { type: 'string' }
                }
              ],
              responses: {
                '200': {
                  description: '订单状态',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          orderId: { type: 'string' },
                          status: { 
                            type: 'string', 
                            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
                          },
                          updatedAt: { type: 'string', format: 'date-time' }
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

      // 第一步：解析 OpenAPI 规范
      const parseResult = parser.parse(spec);
      
      expect(parseResult).toBeDefined();
      expect(parseResult.length).toBe(2); // users 和 orders 两个 API 组
      
      // 验证解析结果
      const userGroup = parseResult.find(group => group.className === 'Users');
      const orderGroup = parseResult.find(group => group.className === 'Orders');
      
      expect(userGroup).toBeDefined();
      expect(orderGroup).toBeDefined();
      
      expect(userGroup!.operations.length).toBe(4); // get, post, get by id, put
      expect(orderGroup!.operations.length).toBe(1); // get order status
      
      // 验证方法名生成
      const userMethods = userGroup!.operations.map(op => op.name);
      expect(userMethods).toContain('getV1Users');
      expect(userMethods).toContain('createV1Users');
      expect(userMethods).toContain('getV1UsersById');
      expect(userMethods).toContain('updateV1Users');
      
      const orderMethods = orderGroup!.operations.map(op => op.name);
      expect(orderMethods).toContain('getV2OrdersStatusById');
      
      // 第二步：生成代码
      const generatedFiles = await generator.generateCode(parseResult, {
        outputDir: testOutputDir,
        projectName: 'integration-test-client'
      });
      
      expect(generatedFiles).toBeDefined();
      expect(generatedFiles.length).toBeGreaterThan(0);
      
      // 验证生成的文件
      const expectedFiles = [
        'types.ts',
        'users.ts', 
        'orders.ts',
        'index.ts',
        'package.json',
        'tsconfig.json'
      ];
      
      expectedFiles.forEach(fileName => {
        const filePath = path.join(testOutputDir, fileName);
        expect(fs.existsSync(filePath)).toBe(true);
      });
      
      // 验证生成的 TypeScript 代码质量
      const usersFileContent = fs.readFileSync(path.join(testOutputDir, 'users.ts'), 'utf-8');
      const ordersFileContent = fs.readFileSync(path.join(testOutputDir, 'orders.ts'), 'utf-8');
      const typesFileContent = fs.readFileSync(path.join(testOutputDir, 'types.ts'), 'utf-8');
      const indexFileContent = fs.readFileSync(path.join(testOutputDir, 'index.ts'), 'utf-8');
      
      // 验证用户模块
      expect(usersFileContent).toContain('export namespace Users');
      expect(usersFileContent).toContain('class GetV1UsersResponse');
      expect(usersFileContent).toContain('class CreateV1UsersRequest');
      expect(usersFileContent).toContain('class CreateV1UsersResponse');
      expect(usersFileContent).toContain('async getV1Users(');
      expect(usersFileContent).toContain('async createV1Users(');
      expect(usersFileContent).toContain('async getV1UsersById(');
      expect(usersFileContent).toContain('async updateV1Users(');
      
      // 验证订单模块
      expect(ordersFileContent).toContain('export namespace Orders');
      expect(ordersFileContent).toContain('class GetOrderStatusResponse');
      expect(ordersFileContent).toContain('async getV2OrdersStatusById(');
      
      // 验证类型定义
      expect(usersFileContent).toContain('@IsString()');
      expect(usersFileContent).toContain('@IsEmail()');
      expect(usersFileContent).toContain('@IsNumber()');
      expect(usersFileContent).toContain('@Min(');
      expect(usersFileContent).toContain('@Max(');
      expect(usersFileContent).toContain('@MinLength(');
      expect(usersFileContent).toContain('@MaxLength(');
      
      // 验证方法参数
      expect(usersFileContent).toContain('getV1UsersById(id: string');
      expect(usersFileContent).toContain('createV1Users(request: CreateV1UsersRequest');
      expect(ordersFileContent).toContain('getV2OrdersStatusById(orderId: string');
      
      // 验证导入和导出
      expect(usersFileContent).toContain("import 'reflect-metadata'");
      expect(usersFileContent).toContain("import { HttpMethod } from 'ts-sdk-client'");
      expect(usersFileContent).toContain("import { APIClient, APIOption } from './types'");
      
      // 验证 index 文件导出
      expect(indexFileContent).toContain("export { Users } from './users'");
      expect(indexFileContent).toContain("export { Orders } from './orders'");
      expect(indexFileContent).toContain("export * from './types'");
      
      // 验证 package.json
      const packageJson = JSON.parse(fs.readFileSync(path.join(testOutputDir, 'package.json'), 'utf-8'));
      expect(packageJson.name).toBe('integration-test-client');
      expect(packageJson.dependencies).toBeDefined();
      expect(packageJson.dependencies['ts-sdk-client']).toBeDefined();
      expect(packageJson.dependencies['class-transformer']).toBeDefined();
      expect(packageJson.dependencies['class-validator']).toBeDefined();
    });

    it('应该处理复杂的嵌套结构', async () => {
      const complexSpec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Complex API', version: '1.0.0' },
        paths: {
          '/api/v1/complex': {
            post: {
              tags: ['complex'],
              operationId: 'complexController_processComplexData',
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        metadata: {
                          type: 'object',
                          properties: {
                            version: { type: 'string' },
                            timestamp: { type: 'string', format: 'date-time' }
                          }
                        },
                        items: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string' },
                              tags: { 
                                type: 'array', 
                                items: { type: 'string' }
                              },
                              nested: {
                                type: 'object',
                                properties: {
                                  level1: {
                                    type: 'object',
                                    properties: {
                                      level2: { type: 'string' }
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
                }
              },
              responses: {
                '200': {
                  description: 'Processed',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          result: { type: 'string' },
                          processedCount: { type: 'number' }
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

      const parseResult = parser.parse(complexSpec);
      const generatedFiles = await generator.generateCode(parseResult, {
        outputDir: testOutputDir,
        projectName: 'complex-test-client'
      });

      expect(generatedFiles.length).toBeGreaterThan(0);
      
      const complexFileContent = fs.readFileSync(path.join(testOutputDir, 'complex.ts'), 'utf-8');
      
      // 验证复杂类型生成
      expect(complexFileContent).toContain('ProcessComplexDataRequest');
      expect(complexFileContent).toContain('ProcessComplexDataResponse');
      expect(complexFileContent).toContain('async processV1Complex(');
      
      // 验证嵌套结构处理
      expect(complexFileContent).toContain('metadata?:');
      expect(complexFileContent).toContain('items?:');
      expect(complexFileContent).toContain('object[]'); // 数组类型
    });
  });

  describe('错误情况处理', () => {
    it('应该正确处理严格验证错误', () => {
      const invalidSpec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Invalid API', version: '1.0.0' },
        paths: {
          '/users': {
            get: {
              operationId: 'userController_getUsers',
              responses: {
                '404': {
                  description: 'Not Found'
                }
                // 缺少 200 响应
              }
            }
          }
        }
      };

      expect(() => {
        parser.parse(invalidSpec);
      }).toThrow('Missing 200 response for operation');
    });

    it('应该正确处理无效的 operationId', () => {
      const invalidOperationIdSpec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Invalid API', version: '1.0.0' },
        paths: {
          '/users': {
            get: {
              operationId: 'Controller_',
              responses: {
                '200': {
                  description: 'Success',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: { data: { type: 'array' } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };

      expect(() => {
        parser.parse(invalidOperationIdSpec);
      }).toThrow('Invalid operationId format');
    });
  });
});
