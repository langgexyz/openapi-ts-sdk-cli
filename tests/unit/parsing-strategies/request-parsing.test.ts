/**
 * Request Type Parsing Strategy 单元测试
 * 测试请求类型解析策略的严格验证功能
 */

import { RequestTypeParsingStrategy } from '../../../src/generator/parsing-strategies';
import { OpenAPIV3 } from 'openapi-types';

type OperationWithPath = {
  operationId: string;
  method: string;
  path: string;
  requestBody?: OpenAPIV3.RequestBodyObject | OpenAPIV3.ReferenceObject;
};

describe('Request Type Parsing Strategy', () => {
  let strategy: RequestTypeParsingStrategy;

  beforeEach(() => {
    strategy = new RequestTypeParsingStrategy();
  });

  describe('canHandle 方法', () => {
    it('应该正确识别可处理的数据', () => {
      const validData = {
        operation: {
          operationId: 'test',
          method: 'post',
          path: '/test',
          requestBody: {}
        },
        typeName: 'TestRequest'
      };

      expect(strategy.canHandle(validData)).toBe(true);
    });

    it('应该拒绝无效的数据', () => {
      expect(strategy.canHandle(null)).toBe(false);
      expect(strategy.canHandle(undefined)).toBe(false);
      expect(strategy.canHandle({})).toBe(false);
      expect(strategy.canHandle({ operation: null })).toBe(false);
    });
  });

  describe('严格验证', () => {
    it('应该在缺少 requestBody 时抛出错误', () => {
      const operation: OperationWithPath = {
        operationId: 'userController_createUser',
        method: 'post',
        path: '/users'
        // 缺少 requestBody
      };

      expect(() => {
        strategy.parse({ operation, typeName: 'CreateUserRequest' });
      }).toThrow('Missing requestBody for operation "userController_createUser" at POST /users');
    });

    it('应该在 requestBody 是 $ref 时抛出错误', () => {
      const operation: OperationWithPath = {
        operationId: 'userController_createUser',
        method: 'post',
        path: '/users',
        requestBody: {
          $ref: '#/components/requestBodies/CreateUserRequest'
        }
      };

      expect(() => {
        strategy.parse({ operation, typeName: 'CreateUserRequest' });
      }).toThrow('RequestBody $ref not supported for operation "userController_createUser"');
    });

    it('应该在缺少 application/json schema 时抛出错误', () => {
      const operation: OperationWithPath = {
        operationId: 'userController_createUser',
        method: 'post',
        path: '/users',
        requestBody: {
          required: true,
          content: {
            'text/plain': {
              schema: { type: 'string' }
            }
            // 缺少 application/json
          }
        }
      };

      expect(() => {
        strategy.parse({ operation, typeName: 'CreateUserRequest' });
      }).toThrow('Missing application/json schema in requestBody');
    });

    it('应该在 schema 为空对象时抛出错误', () => {
      const operation: OperationWithPath = {
        operationId: 'userController_createUser',
        method: 'post',
        path: '/users',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object'
                // 没有 properties
              }
            }
          }
        }
      };

      expect(() => {
        strategy.parse({ operation, typeName: 'CreateUserRequest' });
      }).toThrow('Empty object schema in requestBody');
    });
  });

  describe('正确的解析', () => {
    it('应该正确解析有效的请求体', () => {
      const operation: OperationWithPath = {
        operationId: 'userController_createUser',
        method: 'post',
        path: '/users',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { 
                    type: 'string',
                    description: '用户名'
                  },
                  email: { 
                    type: 'string',
                    format: 'email'
                  },
                  age: {
                    type: 'number',
                    minimum: 0,
                    maximum: 150
                  }
                },
                required: ['name', 'email']
              }
            }
          }
        }
      };

      const result = strategy.parse({ operation, typeName: 'CreateUserRequest' });

      expect(result).toBeDefined();
      expect(result.name).toBe('CreateUserRequest');
      expect(result.properties).toBeDefined();
      expect(result.properties['name']).toBeDefined();
      expect(result.properties['email']).toBeDefined();
      expect(result.properties['age']).toBeDefined();
      
      // 验证必填字段
      expect(result.properties['name'].required).toBe(true);
      expect(result.properties['email'].required).toBe(true);
      expect(result.properties['age'].required).toBe(false);
      
      // 验证类型和格式
      expect(result.properties['name'].type).toBe('string');
      expect(result.properties['email'].format).toBe('email');
      expect(result.properties['age'].minimum).toBe(0);
      expect(result.properties['age'].maximum).toBe(150);
    });

    it('应该处理复杂的嵌套类型', () => {
      const operation: OperationWithPath = {
        operationId: 'orderController_createOrder',
        method: 'post',
        path: '/orders',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  customer: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      email: { type: 'string' }
                    }
                  },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        productId: { type: 'string' },
                        quantity: { type: 'number' }
                      }
                    }
                  },
                  tags: {
                    type: 'array',
                    items: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      };

      const result = strategy.parse({ operation, typeName: 'CreateOrderRequest' });

      expect(result).toBeDefined();
      expect(result.properties['customer']).toBeDefined();
      expect(result.properties['items']).toBeDefined();
      expect(result.properties['tags']).toBeDefined();
    });
  });

  describe('错误信息质量', () => {
    it('错误信息应该包含具体的操作和路径信息', () => {
      const operation: OperationWithPath = {
        operationId: 'productController_updateProduct',
        method: 'put',
        path: '/api/v2/products/{id}'
        // 缺少 requestBody
      };

      expect(() => {
        strategy.parse({ operation, typeName: 'UpdateProductRequest' });
      }).toThrow(expect.stringMatching(/productController_updateProduct.*PUT.*\/api\/v2\/products\/\{id\}/));
    });

    it('错误信息应该提供修复建议', () => {
      const operation: OperationWithPath = {
        operationId: 'userController_createUser',
        method: 'post',
        path: '/users'
      };

      expect(() => {
        strategy.parse({ operation, typeName: 'CreateUserRequest' });
      }).toThrow(expect.stringMatching(/Please define requestBody in your OpenAPI specification/));
    });
  });
});
