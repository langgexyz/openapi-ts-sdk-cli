/**
 * OpenAPI Parser 单元测试
 */

import { OpenAPIParser, ParsedAPI, ParsedOperation } from '../src/generator/openapi-parser';

describe('OpenAPIParser', () => {
  let parser: OpenAPIParser;

  beforeEach(() => {
    parser = new OpenAPIParser();
  });

  describe('基本解析功能', () => {
    test('应该解析简单的 OpenAPI 3.0 规范', () => {
      const spec = {
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
                        items: { type: 'object' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      };

      const result = parser.parse(spec);

      expect(result).toHaveLength(1);
      expect(result[0].className).toBe('User');
      expect(result[0].operations).toHaveLength(1);
      expect(result[0].operations[0].name).toBe('getUsers');
    });

    test('应该处理没有 tags 的操作', () => {
      const spec = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/test': {
            get: {
              operationId: 'test',
              responses: { '200': { description: 'OK' } }
            }
          }
        }
      };

      const result = parser.parse(spec);

      expect(result).toHaveLength(1);
      expect(result[0].className).toBe('Default');
    });

    test('应该处理没有 operationId 的操作', () => {
      const spec = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            get: {
              tags: ['User'],
              responses: { '200': { description: 'OK' } }
            }
          }
        }
      };

      const result = parser.parse(spec);

      expect(result).toHaveLength(1);
      expect(result[0].operations).toHaveLength(1);
      expect(result[0].operations[0].name).toMatch(/^get_users/);
    });
  });

  describe('类型解析', () => {
    test('应该解析请求体类型', () => {
      const spec = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
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
                      required: ['name']
                    }
                  }
                }
              },
              responses: { '200': { description: 'OK' } }
            }
          }
        }
      };

      const result = parser.parse(spec);

      expect(result[0].operations[0].requestType).toBe('CreateUserRequest');
      expect(result[0].types.some(t => t.name === 'CreateUserRequest')).toBeTruthy();
    });

    test('应该解析响应类型', () => {
      const spec = {
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
                        type: 'object',
                        properties: {
                          users: {
                            type: 'array',
                            items: { type: 'object' }
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

      const result = parser.parse(spec);

      expect(result[0].operations[0].responseType).toBe('GetUsersResponse');
      expect(result[0].types.some(t => t.name === 'GetUsersResponse')).toBeTruthy();
    });

    test('应该正确映射基础类型', () => {
      const testCases = [
        { openapi: 'string', expected: 'string' },
        { openapi: 'integer', expected: 'number' },
        { openapi: 'number', expected: 'number' },
        { openapi: 'boolean', expected: 'boolean' },
        { openapi: 'array', expected: 'unknown[]' },
        { openapi: 'object', expected: 'Record<string, unknown>' }
      ];

      testCases.forEach(({ openapi, expected }) => {
        const mapped = (parser as any).mapType({ type: openapi });
        expect(mapped).toBe(expected);
      });
    });
  });

  describe('参数解析', () => {
    test('应该解析路径参数', () => {
      const spec = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
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
                }
              ],
              responses: { '200': { description: 'OK' } }
            }
          }
        }
      };

      const result = parser.parse(spec);
      const operation = result[0].operations[0];

      expect(operation.parameters).toHaveLength(1);
      expect(operation.parameters).toBeDefined();
      expect(operation.parameters!.length).toBe(1);
      expect(operation.parameters![0].name).toBe('id');
      expect(operation.parameters![0].in).toBe('path');
      expect(operation.parameters![0].type).toBe('number');
      expect(operation.parameters![0].required).toBe(true);
    });

    test('应该解析查询参数', () => {
      const spec = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            get: {
              operationId: 'getUsers',
              tags: ['User'],
              parameters: [
                {
                  name: 'limit',
                  in: 'query' as const,
                  required: false,
                  schema: { type: 'integer', default: 10 }
                }
              ],
              responses: { '200': { description: 'OK' } }
            }
          }
        }
      };

      const result = parser.parse(spec);
      const operation = result[0].operations[0];

      expect(operation.parameters).toHaveLength(1);
      expect(operation.parameters).toBeDefined();
      expect(operation.parameters!.length).toBe(1);
      expect(operation.parameters![0].name).toBe('limit');
      expect(operation.parameters![0].in).toBe('query');
      expect(operation.parameters![0].required).toBe(false);
    });
  });

  describe('错误处理', () => {
    test('应该处理无效的 OpenAPI 规范', () => {
      const invalidSpec = {
        // 缺少必要字段
      };

      expect(() => parser.parse(invalidSpec as any)).toThrow();
    });

    test('应该处理空的 paths', () => {
      const spec = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {}
      };

      const result = parser.parse(spec);
      expect(result).toHaveLength(0);
    });
  });

  describe('名称生成', () => {
    test('应该生成有效的操作名称', () => {
      const testCases = [
        { path: '/users', method: 'get', expected: 'get_users' },
        { path: '/users/{id}', method: 'put', expected: 'put_users_id' },
        { path: '/api/v1/posts', method: 'post', expected: 'post_api_v1_posts' }
      ];

      testCases.forEach(({ path, method, expected }) => {
        const name = (parser as any).generateOperationName(path, method);
        expect(name).toBe(expected);
      });
    });

    test('应该简化操作名称', () => {
      const testCases = [
        { operationId: 'UserController_getUsers', expected: 'GetUsersRequest' },
        { operationId: 'Activity20250407_top', expected: 'Activity20250407TopRequest' },
        { operationId: 'twitter_record', expected: 'TwitterRecordRequest' }
      ];

      testCases.forEach(({ operationId, expected }) => {
        const simplified = (parser as any).simplifyOperationName(operationId);
        expect(simplified).toMatch(/^[A-Z]/); // 应该以大写字母开头
      });
    });
  });
});
