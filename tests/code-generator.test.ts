/**
 * Code Generator 单元测试
 */

import { CodeGenerator } from '../src/generator/code-generator';
import { ParsedAPI, ParsedOperation, ParsedType } from '../src/generator/openapi-parser';

describe('CodeGenerator', () => {
  let generator: CodeGenerator;

  beforeEach(() => {
    generator = new CodeGenerator();
  });

  describe('基本代码生成', () => {
    test('应该生成基础类型文件', () => {
      const apis: ParsedAPI[] = [];
      const files = generator.generate(apis, { packageName: 'test-sdk' });

      expect(files.has('types.ts')).toBeTruthy();
      expect(files.has('index.ts')).toBeTruthy();
      
      const typesContent = files.get('types.ts')!;
      expect(typesContent).toContain('export interface ApiConfig');
      expect(typesContent).toContain('export class APIClient');
      expect(typesContent).toContain('export function withUri');
      expect(typesContent).toContain('export function withHeader');
    });

    test('应该生成 API 类文件', () => {
      const mockAPI: ParsedAPI = {
        className: 'User',
        operations: [
          {
            name: 'getUsers',
            method: 'GET',
            path: '/users',
            summary: 'Get users',
            parameters: [],
            requestType: 'GetUsersRequest',
            responseType: 'GetUsersResponse'
          }
        ],
        types: [
          {
            name: 'GetUsersRequest',
            properties: {}
          },
          {
            name: 'GetUsersResponse',
            properties: {
              users: { type: 'User[]', required: true }
            }
          }
        ]
      };

      const files = generator.generate([mockAPI], { packageName: 'test-sdk' });

      expect(files.has('user.api.ts')).toBeTruthy();
      
      const userApiContent = files.get('user.api.ts')!;
      expect(userApiContent).toContain('export class UserApi');
      expect(userApiContent).toContain('async getUsers');
      expect(userApiContent).toContain('interface GetUsersRequest');
      expect(userApiContent).toContain('interface GetUsersResponse');
    });

    test('应该生成索引文件', () => {
      const mockAPI: ParsedAPI = {
        className: 'User',
        operations: [],
        types: []
      };

      const files = generator.generate([mockAPI], { packageName: 'test-sdk' });

      expect(files.has('index.ts')).toBeTruthy();
      
      const indexContent = files.get('index.ts')!;
      expect(indexContent).toContain('export * from "./types"');
      expect(indexContent).toContain('export * from "./user.api"');
      expect(indexContent).toContain('export class UnifiedApiClient');
    });
  });

  describe('类型生成', () => {
    test('应该生成接口定义', () => {
      const mockType: ParsedType = {
        name: 'User',
        properties: {
          id: { type: 'number', required: true },
          name: { type: 'string', required: true },
          email: { type: 'string', required: false }
        }
      };

      const interfaceCode = (generator as any).generateTypeDefinition(mockType);
      
      expect(interfaceCode).toContain('export interface User');
      expect(interfaceCode).toContain('id: number;');
      expect(interfaceCode).toContain('name: string;');
      expect(interfaceCode).toContain('email?: string;');
    });

    test('应该处理复杂类型', () => {
      const mockType: ParsedType = {
        name: 'ComplexType',
        properties: {
          array: { type: 'string[]', required: true },
          object: { type: 'Record<string, unknown>', required: true },
          nested: { type: 'NestedType', required: false }
        }
      };

      const interfaceCode = (generator as any).generateTypeDefinition(mockType);
      
      expect(interfaceCode).toContain('array: string[];');
      expect(interfaceCode).toContain('object: Record<string, unknown>;');
      expect(interfaceCode).toContain('nested?: NestedType;');
    });
  });

  describe('方法生成', () => {
    test('应该生成带参数的 API 方法', () => {
      const mockOperation: ParsedOperation = {
        name: 'getUserById',
        method: 'GET',
        path: '/users/{id}',
        summary: 'Get user by ID',
        parameters: [
          { name: 'id', type: 'number', required: true, in: 'path' }
        ],
        requestType: 'GetUserByIdRequest',
        responseType: 'GetUserByIdResponse'
      };

      const methodCode = (generator as any).generateApiMethod(mockOperation);
      
      expect(methodCode).toContain('async getUserById');
      expect(methodCode).toContain('request: GetUserByIdRequest');
      expect(methodCode).toContain('Promise<GetUserByIdResponse>');
      expect(methodCode).toContain('validateGetUserByIdRequest(request)');
    });

    test('应该生成无参数的 API 方法', () => {
      const mockOperation: ParsedOperation = {
        name: 'getUsers',
        method: 'GET',
        path: '/users',
        summary: 'Get all users',
        parameters: [],
        requestType: '',
        responseType: 'GetUsersResponse'
      };

      const methodCode = (generator as any).generateApiMethod(mockOperation);
      
      expect(methodCode).toContain('async getUsers');
      expect(methodCode).toContain('Promise<GetUsersResponse>');
      expect(methodCode).not.toContain('request:');
    });
  });

  describe('验证函数生成', () => {
    test('应该生成参数验证函数', () => {
      const mockType: ParsedType = {
        name: 'CreateUserRequest',
        properties: {
          name: { type: 'string', required: true },
          email: { type: 'string', required: true },
          age: { type: 'number', required: false }
        }
      };

      const validationCode = (generator as any).generateValidationFunction(mockType);
      
      expect(validationCode).toContain('function validateCreateUserRequest');
      expect(validationCode).toContain('if (!request.name)');
      expect(validationCode).toContain('if (!request.email)');
      expect(validationCode).toContain('typeof request.name !== "string"');
      expect(validationCode).not.toContain('if (!request.age)'); // 可选字段
    });

    test('应该处理特殊格式验证', () => {
      const mockType: ParsedType = {
        name: 'AddressRequest',
        properties: {
          caAddress: { type: 'string', required: true },
          walletAddress: { type: 'string', required: true }
        }
      };

      const validationCode = (generator as any).generateValidationFunction(mockType);
      
      expect(validationCode).toContain('地址格式');
    });
  });

  describe('JSDoc 生成', () => {
    test('应该生成 JSDoc 注释', () => {
      const mockOperation: ParsedOperation = {
        name: 'createUser',
        method: 'POST',
        path: '/users',
        summary: 'Create a new user',
        parameters: [
          { name: 'name', type: 'string', required: true, in: 'body' }
        ],
        requestType: 'CreateUserRequest',
        responseType: 'CreateUserResponse'
      };

      const jsdoc = (generator as any).generateJSDocComment(mockOperation, true, true);
      
      expect(jsdoc).toContain('/**');
      expect(jsdoc).toContain('Create a new user');
      expect(jsdoc).toContain('@param request');
      expect(jsdoc).toContain('@param options');
      expect(jsdoc).toContain('@returns');
      expect(jsdoc).toContain('*/');
    });
  });

  describe('文件名生成', () => {
    test('应该生成正确的文件名', () => {
      const testCases = [
        { className: 'User', expected: 'user.api.ts' },
        { className: 'UserProfile', expected: 'user-profile.api.ts' },
        { className: 'APIStatus', expected: 'api-status.api.ts' }
      ];

      testCases.forEach(({ className, expected }) => {
        const fileName = (generator as any).generateApiFileName(className);
        expect(fileName).toBe(expected);
      });
    });
  });

  describe('配置选项', () => {
    test('应该使用自定义包名', () => {
      const apis: ParsedAPI[] = [];
      const files = generator.generate(apis, { 
        packageName: 'custom-sdk',
        projectName: 'Custom Project'
      });

      const typesContent = files.get('types.ts')!;
      expect(typesContent).toContain('Custom Project');
    });
  });
});
