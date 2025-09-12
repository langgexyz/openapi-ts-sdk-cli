/**
 * OpenAPI Parser 核心解析功能单元测试
 * 测试 OpenAPI 规范的基础解析逻辑
 */

import { OpenAPIParser, APIGroup, APIOperation, TypeDefinition } from '../../../src/generator/openapi-parser';
import { OpenAPIV3 } from 'openapi-types';

describe('OpenAPI Parser - Core Parsing', () => {
  let parser: OpenAPIParser;

  beforeEach(() => {
    parser = new OpenAPIParser();
  });

  describe('基础解析功能', () => {
    it('应该解析简单的 OpenAPI 规范', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            get: {
              tags: ['users'],
              operationId: 'userController_getUsers',
              responses: {
                '200': {
                  description: 'Success',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          users: { type: 'array', items: { type: 'object' } }
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

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      
      const apiGroup = result[0];
      expect(apiGroup.className).toBe('Users');
      expect(apiGroup.operations.length).toBe(1);
      expect(apiGroup.types.length).toBeGreaterThanOrEqual(1);
    });

    it('应该正确解析多个 API 组', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            get: {
              tags: ['users'],
              operationId: 'userController_getUsers',
              responses: {
                '200': {
                  description: 'Success',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          data: { type: 'array' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '/orders': {
            get: {
              tags: ['orders'],
              operationId: 'orderController_getOrders',
              responses: {
                '200': {
                  description: 'Success',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          orders: { type: 'array' }
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

      expect(result.length).toBe(2);
      
      const classNames = result.map(group => group.className).sort();
      expect(classNames).toEqual(['Orders', 'Users']);
    });
  });

  describe('标签处理', () => {
    it('应该基于 tags 正确分组 API', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            get: {
              tags: ['users'],
              operationId: 'userController_getUsers',
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
            },
            post: {
              tags: ['users'],
              operationId: 'userController_createUser',
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' }
                      }
                    }
                  }
                }
              },
              responses: {
                '200': {
                  description: 'Created',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: { id: { type: 'string' } }
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

      expect(result.length).toBe(1);
      expect(result[0].className).toBe('Users');
      expect(result[0].operations.length).toBe(2);
    });

    it('应该处理没有 tags 的操作', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/health': {
            get: {
              operationId: 'healthController_getHealth',
              responses: {
                '200': {
                  description: 'Success',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: { status: { type: 'string' } }
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

      expect(result.length).toBe(1);
      expect(result[0].className).toBe('Health'); // 从 operationId 推断
    });
  });

  describe('操作解析', () => {
    it('应该解析完整的操作信息', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users/{id}': {
            put: {
              tags: ['users'],
              operationId: 'userController_updateUser',
              summary: 'Update user',
              description: 'Update user information',
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
                        email: { type: 'string' }
                      }
                    }
                  }
                }
              },
              responses: {
                '200': {
                  description: 'Updated',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          success: { type: 'boolean' }
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

      expect(result.length).toBe(1);
      
      const operation = result[0].operations[0];
      expect(operation.name).toBe('updateUsers'); // 基于URI的方法名
      expect(operation.method).toBe('put');
      expect(operation.path).toBe('/users/{id}');
      expect(operation.summary).toBe('Update user');
      expect(operation.description).toBe('Update user information');
    });

    it('应该解析路径参数', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users/{userId}/orders/{orderId}': {
            get: {
              tags: ['orders'],
              operationId: 'orderController_getUserOrder',
              parameters: [
                {
                  name: 'userId',
                  in: 'path',
                  required: true,
                  schema: { type: 'string' }
                },
                {
                  name: 'orderId',
                  in: 'path',
                  required: true,
                  schema: { type: 'string' }
                }
              ],
              responses: {
                '200': {
                  description: 'Success',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: { order: { type: 'object' } }
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

      expect(result.length).toBe(1);
      
      const operation = result[0].operations[0];
      expect(operation.name).toBe('getUsersOrdersById');
      expect(operation.pathParams).toBeDefined();
      expect(operation.pathParams.length).toBe(2);
    });
  });

  describe('类型解析', () => {
    it('应该解析请求和响应类型', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            post: {
              tags: ['users'],
              operationId: 'userController_createUser',
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
                          format: 'email',
                          description: '邮箱地址'
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
              },
              responses: {
                '200': {
                  description: 'Created',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          message: { type: 'string' }
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

      expect(result.length).toBe(1);
      expect(result[0].types.length).toBeGreaterThanOrEqual(2);
      
      // 检查是否生成了请求和响应类型
      const typeNames = result[0].types.map(type => type.name);
      expect(typeNames).toContain('CreateUserRequest');
      expect(typeNames).toContain('CreateUserResponse');
      
      // 检查请求类型的属性
      const requestType = result[0].types.find(type => type.name === 'CreateUserRequest');
      expect(requestType).toBeDefined();
      expect(requestType!.properties).toBeDefined();
      expect(requestType!.properties['name']).toBeDefined();
      expect(requestType!.properties['email']).toBeDefined();
      expect(requestType!.properties['age']).toBeDefined();
      
      // 检查必填字段
      expect(requestType!.properties['name'].required).toBe(true);
      expect(requestType!.properties['email'].required).toBe(true);
      expect(requestType!.properties['age'].required).toBe(false);
      
      // 检查验证属性
      expect(requestType!.properties['email'].format).toBe('email');
      expect(requestType!.properties['age'].minimum).toBe(0);
      expect(requestType!.properties['age'].maximum).toBe(150);
    });

    it('应该处理复杂的嵌套类型', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/orders': {
            post: {
              tags: ['orders'],
              operationId: 'orderController_createOrder',
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
              },
              responses: {
                '200': {
                  description: 'Created',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          orderId: { type: 'string' }
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

      expect(result.length).toBe(1);
      
      const requestType = result[0].types.find(type => type.name === 'CreateOrderRequest');
      expect(requestType).toBeDefined();
      expect(requestType!.properties['customer']).toBeDefined();
      expect(requestType!.properties['items']).toBeDefined();
      expect(requestType!.properties['tags']).toBeDefined();
      
      // 检查数组类型解析
      expect(requestType!.properties['items'].type).toMatch(/array/i);
      expect(requestType!.properties['tags'].type).toMatch(/string\[\]|array/i);
    });
  });

  describe('版本处理', () => {
    it('应该处理带版本的路径', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/api/v1/users': {
            get: {
              tags: ['users'],
              operationId: 'userController_getUsers',
              responses: {
                '200': {
                  description: 'Success',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: { users: { type: 'array' } }
                      }
                    }
                  }
                }
              }
            }
          },
          '/api/v2/users': {
            get: {
              tags: ['users'],
              operationId: 'userController_getV2Users',
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

      const result = parser.parse(spec);

      expect(result.length).toBe(1);
      expect(result[0].operations.length).toBe(2);
      
      const methodNames = result[0].operations.map(op => op.name);
      expect(methodNames).toContain('getV1Users');
      expect(methodNames).toContain('getV2Users');
    });
  });

  describe('错误处理', () => {
    it('应该处理空的规范', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Empty API', version: '1.0.0' },
        paths: {}
      };

      const result = parser.parse(spec);
      expect(result).toEqual([]);
    });

    it('应该处理无效的 operationId', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            get: {
              // 缺少 operationId
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

      // 这应该在上层验证中被捕获，这里我们测试解析器的容错性
      expect(() => {
        parser.parse(spec);
      }).toThrow(); // 期望抛出错误
    });
  });
});
