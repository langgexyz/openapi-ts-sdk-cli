/**
 * OpenAPI Parser 类型名提取单元测试
 * 测试从 operationId 提取类型名称的功能
 */

import { OpenAPIParser } from '../../../src/generator/openapi-parser';

describe('OpenAPI Parser - Type Extraction', () => {
  let parser: OpenAPIParser;

  beforeEach(() => {
    parser = new OpenAPIParser();
  });

  // 使用反射访问私有方法进行测试
  const extractTypeNameFromOperationId = (operationId?: string): string => {
    return (parser as any).extractTypeNameFromOperationId(operationId);
  };

  describe('正常的 operationId 处理', () => {
    const normalCases = [
      // 标准格式
      { operationId: 'userController_getUsers', expected: 'GetUsers' },
      { operationId: 'userController_createUser', expected: 'CreateUser' },
      { operationId: 'orderController_updateOrder', expected: 'UpdateOrder' },
      { operationId: 'productController_deleteProduct', expected: 'DeleteProduct' },
      
      // 不同的 Controller 前缀格式
      { operationId: 'UserController_getUsers', expected: 'GetUsers' },
      { operationId: 'OrderController_createOrder', expected: 'CreateOrder' },
      { operationId: 'ProductController_updateProduct', expected: 'UpdateProduct' },
      
      // API 前缀格式
      { operationId: 'userApi_getUsers', expected: 'GetUsers' },
      { operationId: 'UserApi_createUser', expected: 'CreateUser' },
      { operationId: 'orderAPI_updateOrder', expected: 'UpdateOrder' },
      
      // 混合格式
      { operationId: 'user_getUsers', expected: 'GetUsers' },
      { operationId: 'order_createOrder', expected: 'CreateOrder' },
    ];

    normalCases.forEach(({ operationId, expected }) => {
      it(`${operationId} -> ${expected}`, () => {
        const result = extractTypeNameFromOperationId(operationId);
        expect(result).toBe(expected);
      });
    });
  });

  describe('复杂方法名处理', () => {
    const complexCases = [
      // 复杂的方法名
      { operationId: 'userController_getUserProfileSettings', expected: 'GetUserProfileSettings' },
      { operationId: 'orderController_createOrderWithItems', expected: 'CreateOrderWithItems' },
      { operationId: 'productController_updateProductInventoryStatus', expected: 'UpdateProductInventoryStatus' },
      
      // 带下划线的方法名
      { operationId: 'userController_get_user_by_email', expected: 'GetUserByEmail' },
      { operationId: 'orderController_create_order_item', expected: 'CreateOrderItem' },
      
      // 驼峰式方法名
      { operationId: 'userController_getUserById', expected: 'GetUserById' },
      { operationId: 'orderController_createNewOrder', expected: 'CreateNewOrder' },
    ];

    complexCases.forEach(({ operationId, expected }) => {
      it(`${operationId} -> ${expected}`, () => {
        const result = extractTypeNameFromOperationId(operationId);
        expect(result).toBe(expected);
      });
    });
  });

  describe('边缘情况处理', () => {
    it('应该处理只有方法名的情况', () => {
      const result = extractTypeNameFromOperationId('getUsers');
      expect(result).toBe('GetUsers');
    });

    it('应该处理额外下划线的情况', () => {
      const result1 = extractTypeNameFromOperationId('userController__getUsers');
      const result2 = extractTypeNameFromOperationId('userController_getUsers_');
      
      expect(result1).toBe('GetUsers');
      expect(result2).toBe('GetUsers');
    });

    it('应该处理大小写混合的情况', () => {
      const result1 = extractTypeNameFromOperationId('UserController_GetUsers');
      const result2 = extractTypeNameFromOperationId('usercontroller_getusers');
      
      expect(result1).toBe('GetUsers');
      expect(result2).toBe('Getusers');
    });
  });

  describe('错误处理', () => {
    it('应该在 operationId 为空时抛出错误', () => {
      expect(() => {
        extractTypeNameFromOperationId();
      }).toThrow('operationId is required for generating type names');
    });

    it('应该在 operationId 为空字符串时抛出错误', () => {
      expect(() => {
        extractTypeNameFromOperationId('');
      }).toThrow('operationId is required for generating type names');
    });

    it('应该在 operationId 只有前缀时抛出错误', () => {
      expect(() => {
        extractTypeNameFromOperationId('Controller_');
      }).toThrow('Invalid operationId format: "Controller_"');
      
      expect(() => {
        extractTypeNameFromOperationId('userController_');
      }).toThrow('Invalid operationId format: "userController_"');
      
      expect(() => {
        extractTypeNameFromOperationId('Api_');
      }).toThrow('Invalid operationId format: "Api_"');
    });

    it('应该在 operationId 只有空白字符时抛出错误', () => {
      expect(() => {
        extractTypeNameFromOperationId('   ');
      }).toThrow('operationId is required for generating type names');
      
      expect(() => {
        extractTypeNameFromOperationId('userController_   ');
      }).toThrow('Invalid operationId format');
    });
  });

  describe('类型名一致性验证', () => {
    it('生成的类型名应该是有效的 TypeScript 标识符', () => {
      const testCases = [
        'userController_getUsers',
        'orderController_createOrder',
        'productController_updateProduct',
        'dataController_analyzeMetrics'
      ];

      testCases.forEach(operationId => {
        const result = extractTypeNameFromOperationId(operationId);
        
        // 验证是否为有效的 TypeScript 标识符
        expect(result).toMatch(/^[A-Z][a-zA-Z0-9]*$/);
        
        // 验证是否以大写字母开头（PascalCase）
        expect(result[0]).toMatch(/[A-Z]/);
        
        // 验证不包含特殊字符
        expect(result).not.toMatch(/[^a-zA-Z0-9]/);
      });
    });

    it('相同的操作名应该生成相同的类型名', () => {
      const variants = [
        'userController_getUsers',
        'UserController_getUsers',
        'user_getUsers',
        'userApi_getUsers',
        'UserApi_getUsers'
      ];

      const results = variants.map(extractTypeNameFromOperationId);
      
      // 所有变体都应该生成相同的类型名
      expect(new Set(results).size).toBe(1);
      expect(results[0]).toBe('GetUsers');
    });
  });

  describe('性能测试', () => {
    it('应该快速处理大量 operationId', () => {
      const operationIds = Array.from({ length: 1000 }, (_, i) => 
        `userController_getUser${i}`
      );

      const start = Date.now();
      
      operationIds.forEach(operationId => {
        extractTypeNameFromOperationId(operationId);
      });
      
      const duration = Date.now() - start;
      
      // 1000个操作应该在100ms内完成
      expect(duration).toBeLessThan(100);
    });

    it('应该处理超长的 operationId', () => {
      const longOperationId = 'userController_' + 'a'.repeat(1000);
      
      expect(() => {
        const result = extractTypeNameFromOperationId(longOperationId);
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
      }).not.toThrow();
    });
  });
});
