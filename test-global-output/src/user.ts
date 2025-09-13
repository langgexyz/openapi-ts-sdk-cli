/**
 * ⚠️  此文件由 openapi-ts-sdk-cli 自动生成，请勿手动修改！
 * 
 * 📅 生成时间: 2025-09-13T06:00:45.039Z
 * 🔧 生成工具: openapi-ts-sdk-cli
 * 📄 源文件: OpenAPI 规范文档
 * 
 * 💡 如需修改，请：
 * 1. 修改服务器端的 OpenAPI 规范
 * 2. 重新运行 openapi-ts-sdk-cli 生成
 * 
 * 🚫 请勿直接编辑此文件，修改将在下次生成时被覆盖！
 */

import 'reflect-metadata';
import { HttpMethod } from 'openapi-ts-sdk';
import { APIClient, APIOption, APIConfig } from './types';
import { Json, ClassArray } from 'ts-json';
import { IsString, IsNumber, IsBoolean, IsOptional, IsEmail, Min, Max, MinLength, MaxLength, Matches, validate } from 'class-validator';

export namespace User {
  /** 获取用户列表 */
  export class GetusersResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** CreateuserRequest data type */
  export class CreateuserRequest {
    @IsString()
    name!: string;

    @IsString()
    email!: string;

    @IsNumber()
    @IsOptional()
    age?: number;

    /** 验证请求数据 */
    async validate(): Promise<void> {
      const errors = await validate(this);
      
      if (errors.length > 0) {
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {}).join(', ')
        ).join('; ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }
    }
  }

  /** 创建用户 */
  export class CreateuserResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 获取单个用户 */
  export class GetuserResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** UpdateuserRequest data type */
  export class UpdateuserRequest {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsNumber()
    @IsOptional()
    age?: number;

    /** 验证请求数据 */
    async validate(): Promise<void> {
      const errors = await validate(this);
      
      if (errors.length > 0) {
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {}).join(', ')
        ).join('; ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }
    }
  }

  /** 更新用户 */
  export class UpdateuserResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 删除用户 */
  export class DeleteuserResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** PatchuserRequest data type */
  export class PatchuserRequest {
    @IsString()
    @IsOptional()
    name?: string;

    /** 验证请求数据 */
    async validate(): Promise<void> {
      const errors = await validate(this);
      
      if (errors.length > 0) {
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {}).join(', ')
        ).join('; ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }
    }
  }

  /** 部分更新用户 */
  export class PatchuserResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 获取用户列表 响应类型 */
  export class GetUsersResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 获取用户列表 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 GET /api/users/ 操作的requestBody定义不完整
   * • 可能缺少具体的schema定义或属性描述
   * 
     * 🛠️  服务器端开发者需要完善：
     * 1. 在Controller中完善 @ApiBody() 装饰器
     * 2. 添加完整的DTO类定义并使用 @ApiProperty() 装饰器
     * 3. 确保OpenAPI规范包含详细的requestBody.content.application/json.schema
     * 4. 重新生成OpenAPI规范文档
     * 
     * 📝 服务器端完善示例：
     * ```typescript
     * @ApiBody({ type: GetUsersRequest })
     * async getusers(@Body() request: GetUsersRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class GetUsersRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 usercontroller_getusers 的API文档或服务端DTO定义

    /** 验证请求数据 */
    async validate(): Promise<void> {
      const errors = await validate(this);
      
      if (errors.length > 0) {
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {}).join(', ')
        ).join('; ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }
    }
  }

  /** 创建用户 响应类型 */
  export class CreateUsersResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 创建用户 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 POST /api/users/ 操作的requestBody定义不完整
   * • 可能缺少具体的schema定义或属性描述
   * 
     * 🛠️  服务器端开发者需要完善：
     * 1. 在Controller中完善 @ApiBody() 装饰器
     * 2. 添加完整的DTO类定义并使用 @ApiProperty() 装饰器
     * 3. 确保OpenAPI规范包含详细的requestBody.content.application/json.schema
     * 4. 重新生成OpenAPI规范文档
     * 
     * 📝 服务器端完善示例：
     * ```typescript
     * @ApiBody({ type: CreateUsersRequest })
     * async createuser(@Body() request: CreateUsersRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class CreateUsersRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 usercontroller_createuser 的API文档或服务端DTO定义

    /** 验证请求数据 */
    async validate(): Promise<void> {
      const errors = await validate(this);
      
      if (errors.length > 0) {
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {}).join(', ')
        ).join('; ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }
    }
  }

  /** 获取单个用户 响应类型 */
  export class GetUsersByIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 获取单个用户 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 GET /api/users/{id} 操作的requestBody定义不完整
   * • 可能缺少具体的schema定义或属性描述
   * 
     * 🛠️  服务器端开发者需要完善：
     * 1. 在Controller中完善 @ApiBody() 装饰器
     * 2. 添加完整的DTO类定义并使用 @ApiProperty() 装饰器
     * 3. 确保OpenAPI规范包含详细的requestBody.content.application/json.schema
     * 4. 重新生成OpenAPI规范文档
     * 
     * 📝 服务器端完善示例：
     * ```typescript
     * @ApiBody({ type: GetUsersByIdRequest })
     * async getuser(@Body() request: GetUsersByIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class GetUsersByIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 usercontroller_getuser 的API文档或服务端DTO定义

    /** 验证请求数据 */
    async validate(): Promise<void> {
      const errors = await validate(this);
      
      if (errors.length > 0) {
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {}).join(', ')
        ).join('; ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }
    }
  }

  /** 更新用户 响应类型 */
  export class UpdateUsersByIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 更新用户 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 PUT /api/users/{id} 操作的requestBody定义不完整
   * • 可能缺少具体的schema定义或属性描述
   * 
     * 🛠️  服务器端开发者需要完善：
     * 1. 在Controller中完善 @ApiBody() 装饰器
     * 2. 添加完整的DTO类定义并使用 @ApiProperty() 装饰器
     * 3. 确保OpenAPI规范包含详细的requestBody.content.application/json.schema
     * 4. 重新生成OpenAPI规范文档
     * 
     * 📝 服务器端完善示例：
     * ```typescript
     * @ApiBody({ type: UpdateUsersByIdRequest })
     * async updateuser(@Body() request: UpdateUsersByIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class UpdateUsersByIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 usercontroller_updateuser 的API文档或服务端DTO定义

    /** 验证请求数据 */
    async validate(): Promise<void> {
      const errors = await validate(this);
      
      if (errors.length > 0) {
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {}).join(', ')
        ).join('; ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }
    }
  }

  /** 删除用户 响应类型 */
  export class DeleteUsersByIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 删除用户 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 DELETE /api/users/{id} 操作的requestBody定义不完整
   * • 可能缺少具体的schema定义或属性描述
   * 
     * 🛠️  服务器端开发者需要完善：
     * 1. 在Controller中完善 @ApiBody() 装饰器
     * 2. 添加完整的DTO类定义并使用 @ApiProperty() 装饰器
     * 3. 确保OpenAPI规范包含详细的requestBody.content.application/json.schema
     * 4. 重新生成OpenAPI规范文档
     * 
     * 📝 服务器端完善示例：
     * ```typescript
     * @ApiBody({ type: DeleteUsersByIdRequest })
     * async deleteuser(@Body() request: DeleteUsersByIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class DeleteUsersByIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 usercontroller_deleteuser 的API文档或服务端DTO定义

    /** 验证请求数据 */
    async validate(): Promise<void> {
      const errors = await validate(this);
      
      if (errors.length > 0) {
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {}).join(', ')
        ).join('; ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }
    }
  }

  /** 部分更新用户 响应类型 */
  export class PatchUsersByIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 部分更新用户 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 PATCH /api/users/{id} 操作的requestBody定义不完整
   * • 可能缺少具体的schema定义或属性描述
   * 
     * 🛠️  服务器端开发者需要完善：
     * 1. 在Controller中完善 @ApiBody() 装饰器
     * 2. 添加完整的DTO类定义并使用 @ApiProperty() 装饰器
     * 3. 确保OpenAPI规范包含详细的requestBody.content.application/json.schema
     * 4. 重新生成OpenAPI规范文档
     * 
     * 📝 服务器端完善示例：
     * ```typescript
     * @ApiBody({ type: PatchUsersByIdRequest })
     * async patchuser(@Body() request: PatchUsersByIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class PatchUsersByIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 usercontroller_patchuser 的API文档或服务端DTO定义

    /** 验证请求数据 */
    async validate(): Promise<void> {
      const errors = await validate(this);
      
      if (errors.length > 0) {
        const errorMessages = errors.map(error => 
          Object.values(error.constraints || {}).join(', ')
        ).join('; ');
        throw new Error(`Validation failed: ${errorMessages}`);
      }
    }
  }


  /** User 模块客户端 */
  export class Client extends APIClient {  /**
   * 获取用户列表
   * 
   * @description Execute 获取用户列表 operation
   * @method GET
   * @path /api/users/
   * 
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<GetUsersResponse>} Returns API response result
   * 
   * @example
   * const result = await api.getUsers();
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async getUsers(...options: APIOption[]): Promise<GetUsersResponse> {

    return this.executeRequest<GetUsersRequest, GetUsersResponse>(
      HttpMethod.GET,
      '/api/users/',
      new GetUsersRequest(),
      GetUsersResponse,
      options
    );
  }

  /**
   * 创建用户
   * 
   * @description Execute 创建用户 operation
   * @method POST
   * @path /api/users/
   * 
   * @param {CreateUsersRequest} request - Request parameters
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<CreateUsersResponse>} Returns API response result
   * 
   * @example
   * const result = await api.createUsers(request);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async createUsers(request: User.CreateUsersRequest, ...options: APIOption[]): Promise<CreateUsersResponse> {
      await request.validate();

    return this.executeRequest<CreateUsersRequest, CreateUsersResponse>(
      HttpMethod.POST,
      '/api/users/',
      request,
      CreateUsersResponse,
      options
    );
  }

  /**
   * 获取单个用户
   * 
   * @description Execute 获取单个用户 operation
   * @method GET
   * @path /api/users/{id}
   * 
   * @param {string} id - Path parameter
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<GetUsersByIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.getUsersById(id);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async getUsersById(id: string, ...options: APIOption[]): Promise<GetUsersByIdResponse> {

    return this.executeRequest<GetUsersByIdRequest, GetUsersByIdResponse>(
      HttpMethod.GET,
      `/api/users/${id}`,
      new GetUsersByIdRequest(),
      GetUsersByIdResponse,
      options
    );
  }

  /**
   * 更新用户
   * 
   * @description Execute 更新用户 operation
   * @method PUT
   * @path /api/users/{id}
   * 
   * @param {string} id - Path parameter
   * @param {UpdateUsersByIdRequest} request - Request parameters
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<UpdateUsersByIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.updateUsersById(id, request);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async updateUsersById(id: string, request: User.UpdateUsersByIdRequest, ...options: APIOption[]): Promise<UpdateUsersByIdResponse> {
      await request.validate();

    return this.executeRequest<UpdateUsersByIdRequest, UpdateUsersByIdResponse>(
      HttpMethod.PUT,
      `/api/users/${id}`,
      request,
      UpdateUsersByIdResponse,
      options
    );
  }

  /**
   * 删除用户
   * 
   * @description Execute 删除用户 operation
   * @method DELETE
   * @path /api/users/{id}
   * 
   * @param {string} id - Path parameter
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<DeleteUsersByIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.deleteUsersById(id);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async deleteUsersById(id: string, ...options: APIOption[]): Promise<DeleteUsersByIdResponse> {

    return this.executeRequest<DeleteUsersByIdRequest, DeleteUsersByIdResponse>(
      HttpMethod.DELETE,
      `/api/users/${id}`,
      new DeleteUsersByIdRequest(),
      DeleteUsersByIdResponse,
      options
    );
  }

  /**
   * 部分更新用户
   * 
   * @description Execute 部分更新用户 operation
   * @method PATCH
   * @path /api/users/{id}
   * 
   * @param {string} id - Path parameter
   * @param {PatchUsersByIdRequest} request - Request parameters
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<PatchUsersByIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.patchUsersById(id, request);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async patchUsersById(id: string, request: User.PatchUsersByIdRequest, ...options: APIOption[]): Promise<PatchUsersByIdResponse> {
      await request.validate();

    return this.executeRequest<PatchUsersByIdRequest, PatchUsersByIdResponse>(
      HttpMethod.PATCH,
      `/api/users/${id}`,
      request,
      PatchUsersByIdResponse,
      options
    );
  }


  }
}
