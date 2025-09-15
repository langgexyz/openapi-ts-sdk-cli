/**
 * OpenAPI Parser 严格验证单元测试
 * 测试严格验证逻辑，确保不完整的规范会被正确拒绝
 */

import { OpenAPIParser } from '../../../src/generator/openapi-parser';
import { OpenAPIV3 } from 'openapi-types';

describe('OpenAPI Parser - Strict Validation', () => {
  let parser: OpenAPIParser;

  beforeEach(() => {
    parser = new OpenAPIParser();
  });

  describe('Request Body 验证', () => {
    it('应该在缺少 requestBody 时抛出错误', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            post: {
              operationId: 'userController_createUser',
              responses: {
                '200': {
                  description: 'Success',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' }
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

      expect(() => {
        parser.parse(spec);
      }).toThrow('Missing requestBody for operation "userController_createUser" at POST /users');
    });

    it('应该在 requestBody 缺少 schema 时抛出错误', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            post: {
              operationId: 'userController_createUser',
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    // 缺少 schema
                  }
                }
              },
              responses: {
                '200': {
                  description: 'Success',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' }
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

      expect(() => {
        parser.parse(spec);
      }).toThrow('Missing application/json schema in requestBody for operation "userController_createUser"');
    });

    it('应该在 requestBody schema 为空对象时抛出错误', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            post: {
              operationId: 'userController_createUser',
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
              },
              responses: {
                '200': {
                  description: 'Success',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' }
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

      expect(() => {
        parser.parse(spec);
      }).toThrow('Empty object schema in requestBody for operation "userController_createUser"');
    });
  });

  describe('Response 验证', () => {
    it('应该在缺少 200 响应时抛出错误', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
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
        parser.parse(spec);
      }).toThrow('Missing 200 response for operation "userController_getUsers" at GET /users');
    });

    it('应该在 200 响应缺少 schema 时抛出错误', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            get: {
              operationId: 'userController_getUsers',
              responses: {
                '200': {
                  description: 'Success',
                  content: {
                    'application/json': {
                      // 缺少 schema
                    }
                  }
                }
              }
            }
          }
        }
      };

      expect(() => {
        parser.parse(spec);
      }).toThrow('Missing application/json schema in 200 response for operation "userController_getUsers"');
    });

    it('应该在响应 schema 为空对象时抛出错误', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            get: {
              operationId: 'userController_getUsers',
              responses: {
                '200': {
                  description: 'Success',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object'
                        // 没有 properties
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
        parser.parse(spec);
      }).toThrow('Empty object schema in 200 response for operation "userController_getUsers"');
    });
  });

  describe('正确的规范应该通过验证', () => {
    it('应该成功解析完整的规范', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            get: {
              operationId: 'userController_getUsers',
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
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'string' },
                                name: { type: 'string' }
                              }
                            }
                          },
                          total: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            },
            post: {
              operationId: 'userController_createUser',
              requestBody: {
                required: true,
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

      expect(() => {
        const result = parser.parse(spec);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
      }).not.toThrow();
    });

    it('应该成功解析带版本的规范', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/api/v1/users': {
            get: {
              operationId: 'userController_getUsers',
              responses: {
                '200': {
                  description: 'Success',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          data: { type: 'array', items: { type: 'object' } }
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

      expect(() => {
        const result = parser.parse(spec);
        expect(result).toBeDefined();
      }).not.toThrow();
    });
  });

  describe('$ref 引用验证', () => {
    it('应该在不支持的 requestBody $ref 时给出错误', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            post: {
              operationId: 'userController_createUser',
              requestBody: {
                $ref: '#/components/requestBodies/CreateUserRequest'
              },
              responses: {
                '200': {
                  description: 'Success',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' }
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

      expect(() => {
        parser.parse(spec);
      }).toThrow('RequestBody $ref not supported for operation "userController_createUser"');
    });

    it('应该在不支持的 response $ref 时给出错误', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            get: {
              operationId: 'userController_getUsers',
              responses: {
                '200': {
                  $ref: '#/components/responses/UserListResponse'
                }
              }
            }
          }
        }
      };

      expect(() => {
        parser.parse(spec);
      }).toThrow('Response $ref not supported for operation "userController_getUsers"');
    });
  });

  describe('错误信息质量', () => {
    it('错误信息应该包含具体的操作和路径信息', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/api/v2/products/{id}/reviews': {
            post: {
              operationId: 'productController_createProductReview',
              responses: {
                '200': {
                  description: 'Success'
                  // 缺少 content
                }
              }
            }
          }
        }
      };

      expect(() => {
        parser.parse(spec);
      }).toThrow(expect.stringMatching(/productController_createProductReview.*POST.*\/api\/v2\/products\/\{id\}\/reviews/));
    });

    it('错误信息应该提供修复建议', () => {
      const spec: OpenAPIV3.Document = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            post: {
              operationId: 'userController_createUser',
              responses: {
                '200': {
                  description: 'Success',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
              // 缺少 requestBody
            }
          }
        }
      };

      expect(() => {
        parser.parse(spec);
      }).toThrow(expect.stringMatching(/Please define requestBody in your OpenAPI specification/));
    });
  });
});
