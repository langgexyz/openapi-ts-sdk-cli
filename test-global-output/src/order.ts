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

export namespace Order {
  /** 获取订单列表 */
  export class GetordersResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** CreateorderRequest data type */
  export class CreateorderRequest {
    @IsNumber()
    userId!: number; // 用户ID

    @IsString()
    productName!: string; // 商品名称

    @IsNumber()
    amount!: number; // 订单金额

    @IsNumber()
    @IsOptional()
    quantity?: number; // 商品数量

    @IsString()
    shippingAddress!: string; // 配送地址

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

  /** 创建订单 */
  export class CreateorderResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 获取订单详情 */
  export class GetorderResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** UpdateorderstatusRequest data type */
  export class UpdateorderstatusRequest {
    @IsString()
    status!: string; // 订单状态

    @IsString()
    @IsOptional()
    note?: string; // 状态更新备注

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

  /** 更新订单状态 */
  export class UpdateorderstatusResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 订单统计 */
  export class GetorderstatsResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 获取订单列表 响应类型 */
  export class GetOrdersResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 获取订单列表 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 GET /api/orders/ 操作的requestBody定义不完整
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
     * @ApiBody({ type: GetOrdersRequest })
     * async getorders(@Body() request: GetOrdersRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class GetOrdersRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 ordercontroller_getorders 的API文档或服务端DTO定义

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

  /** 创建订单 响应类型 */
  export class CreateOrdersResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 创建订单 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 POST /api/orders/ 操作的requestBody定义不完整
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
     * @ApiBody({ type: CreateOrdersRequest })
     * async createorder(@Body() request: CreateOrdersRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class CreateOrdersRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 ordercontroller_createorder 的API文档或服务端DTO定义

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

  /** 获取订单详情 响应类型 */
  export class GetOrdersByIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 获取订单详情 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 GET /api/orders/{id} 操作的requestBody定义不完整
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
     * @ApiBody({ type: GetOrdersByIdRequest })
     * async getorder(@Body() request: GetOrdersByIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class GetOrdersByIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 ordercontroller_getorder 的API文档或服务端DTO定义

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

  /** 更新订单状态 响应类型 */
  export class UpdateOrdersStatusByIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 更新订单状态 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 PUT /api/orders/{id}/status 操作的requestBody定义不完整
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
     * @ApiBody({ type: UpdateOrdersStatusByIdRequest })
     * async updateorderstatus(@Body() request: UpdateOrdersStatusByIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class UpdateOrdersStatusByIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 ordercontroller_updateorderstatus 的API文档或服务端DTO定义

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

  /** 订单统计 响应类型 */
  export class GetOrdersStatsResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 订单统计 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 GET /api/orders/stats 操作的requestBody定义不完整
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
     * @ApiBody({ type: GetOrdersStatsRequest })
     * async getorderstats(@Body() request: GetOrdersStatsRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class GetOrdersStatsRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 ordercontroller_getorderstats 的API文档或服务端DTO定义

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


  /** Order 模块客户端 */
  export class Client extends APIClient {  /**
   * 获取订单列表
   * 
   * @description Execute 获取订单列表 operation
   * @method GET
   * @path /api/orders/
   * 
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<GetOrdersResponse>} Returns API response result
   * 
   * @example
   * const result = await api.getOrders();
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async getOrders(...options: APIOption[]): Promise<GetOrdersResponse> {

    return this.executeRequest<GetOrdersRequest, GetOrdersResponse>(
      HttpMethod.GET,
      '/api/orders/',
      new GetOrdersRequest(),
      GetOrdersResponse,
      options
    );
  }

  /**
   * 创建订单
   * 
   * @description Execute 创建订单 operation
   * @method POST
   * @path /api/orders/
   * 
   * @param {CreateOrdersRequest} request - Request parameters
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<CreateOrdersResponse>} Returns API response result
   * 
   * @example
   * const result = await api.createOrders(request);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async createOrders(request: Order.CreateOrdersRequest, ...options: APIOption[]): Promise<CreateOrdersResponse> {
      await request.validate();

    return this.executeRequest<CreateOrdersRequest, CreateOrdersResponse>(
      HttpMethod.POST,
      '/api/orders/',
      request,
      CreateOrdersResponse,
      options
    );
  }

  /**
   * 获取订单详情
   * 
   * @description Execute 获取订单详情 operation
   * @method GET
   * @path /api/orders/{id}
   * 
   * @param {string} id - Path parameter
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<GetOrdersByIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.getOrdersById(id);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async getOrdersById(id: string, ...options: APIOption[]): Promise<GetOrdersByIdResponse> {

    return this.executeRequest<GetOrdersByIdRequest, GetOrdersByIdResponse>(
      HttpMethod.GET,
      `/api/orders/${id}`,
      new GetOrdersByIdRequest(),
      GetOrdersByIdResponse,
      options
    );
  }

  /**
   * 更新订单状态
   * 
   * @description Execute 更新订单状态 operation
   * @method PUT
   * @path /api/orders/{id}/status
   * 
   * @param {string} id - Path parameter
   * @param {UpdateOrdersStatusByIdRequest} request - Request parameters
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<UpdateOrdersStatusByIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.updateOrdersStatusById(id, request);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async updateOrdersStatusById(id: string, request: Order.UpdateOrdersStatusByIdRequest, ...options: APIOption[]): Promise<UpdateOrdersStatusByIdResponse> {
      await request.validate();

    return this.executeRequest<UpdateOrdersStatusByIdRequest, UpdateOrdersStatusByIdResponse>(
      HttpMethod.PUT,
      `/api/orders/${id}/status`,
      request,
      UpdateOrdersStatusByIdResponse,
      options
    );
  }

  /**
   * 订单统计
   * 
   * @description Execute 订单统计 operation
   * @method GET
   * @path /api/orders/stats
   * 
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<GetOrdersStatsResponse>} Returns API response result
   * 
   * @example
   * const result = await api.getOrdersStats();
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async getOrdersStats(...options: APIOption[]): Promise<GetOrdersStatsResponse> {

    return this.executeRequest<GetOrdersStatsRequest, GetOrdersStatsResponse>(
      HttpMethod.GET,
      '/api/orders/stats',
      new GetOrdersStatsRequest(),
      GetOrdersStatsResponse,
      options
    );
  }


  }
}
