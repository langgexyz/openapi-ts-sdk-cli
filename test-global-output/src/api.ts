/**
 * ⚠️  此文件由 openapi-ts-sdk-cli 自动生成，请勿手动修改！
 * 
 * 📅 生成时间: 2025-09-13T06:00:45.038Z
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

export namespace Api {
  /** 健康检查 响应类型 */
  export class GetHealthResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 健康检查 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 GET /api/health 操作的requestBody定义不完整
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
     * @ApiBody({ type: GetHealthRequest })
     * async health(@Body() request: GetHealthRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class GetHealthRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 apicontroller_health 的API文档或服务端DTO定义

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

  /** 状态检查 响应类型 */
  export class HeadStatusResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 状态检查 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 HEAD /api/status 操作的requestBody定义不完整
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
     * @ApiBody({ type: HeadStatusRequest })
     * async status(@Body() request: HeadStatusRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class HeadStatusRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 apicontroller_status 的API文档或服务端DTO定义

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

  /** 全局搜索 响应类型 */
  export class GetSearchResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 全局搜索 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 GET /api/search 操作的requestBody定义不完整
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
     * @ApiBody({ type: GetSearchRequest })
     * async search(@Body() request: GetSearchRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class GetSearchRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 apicontroller_search 的API文档或服务端DTO定义

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


  /** Api 模块客户端 */
  export class Client extends APIClient {  /**
   * 健康检查
   * 
   * @description Execute 健康检查 operation
   * @method GET
   * @path /api/health
   * 
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<GetHealthResponse>} Returns API response result
   * 
   * @example
   * const result = await api.getHealth();
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async getHealth(...options: APIOption[]): Promise<GetHealthResponse> {

    return this.executeRequest<GetHealthRequest, GetHealthResponse>(
      HttpMethod.GET,
      '/api/health',
      new GetHealthRequest(),
      GetHealthResponse,
      options
    );
  }

  /**
   * 状态检查
   * 
   * @description Execute 状态检查 operation
   * @method HEAD
   * @path /api/status
   * 
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<HeadStatusResponse>} Returns API response result
   * 
   * @example
   * const result = await api.headStatus();
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async headStatus(...options: APIOption[]): Promise<HeadStatusResponse> {

    return this.executeRequest<HeadStatusRequest, HeadStatusResponse>(
      HttpMethod.HEAD,
      '/api/status',
      new HeadStatusRequest(),
      HeadStatusResponse,
      options
    );
  }

  /**
   * 全局搜索
   * 
   * @description Execute 全局搜索 operation
   * @method GET
   * @path /api/search
   * 
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<GetSearchResponse>} Returns API response result
   * 
   * @example
   * const result = await api.getSearch();
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async getSearch(...options: APIOption[]): Promise<GetSearchResponse> {

    return this.executeRequest<GetSearchRequest, GetSearchResponse>(
      HttpMethod.GET,
      '/api/search',
      new GetSearchRequest(),
      GetSearchResponse,
      options
    );
  }


  }
}
