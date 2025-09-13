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

export namespace Productservice {
  /** 获取产品列表 响应类型 */
  export class GetProductsResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 获取产品列表 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 GET /api/products/ 操作的requestBody定义不完整
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
     * @ApiBody({ type: GetProductsRequest })
     * async getproducts(@Body() request: GetProductsRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class GetProductsRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 productservice_getproducts 的API文档或服务端DTO定义

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

  /** 获取特定品牌分类下的产品详情 响应类型 */
  export class GetProductsBrandsItemsByItemIdBrandIdCategoryIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 获取特定品牌分类下的产品详情 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 GET /api/products/{categoryId}/brands/{brandId}/items/{itemId} 操作的requestBody定义不完整
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
     * @ApiBody({ type: GetProductsBrandsItemsByItemIdBrandIdCategoryIdRequest })
     * async getproductdetail(@Body() request: GetProductsBrandsItemsByItemIdBrandIdCategoryIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class GetProductsBrandsItemsByItemIdBrandIdCategoryIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 productservice_getproductdetail 的API文档或服务端DTO定义

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

  /** 更新产品分类 响应类型 */
  export class UpdateProductsCategoriesByCategoryIdProductIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 更新产品分类 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 PUT /api/products/{productId}/categories/{categoryId} 操作的requestBody定义不完整
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
     * @ApiBody({ type: UpdateProductsCategoriesByCategoryIdProductIdRequest })
     * async updateproductcategory(@Body() request: UpdateProductsCategoriesByCategoryIdProductIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class UpdateProductsCategoriesByCategoryIdProductIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 productservice_updateproductcategory 的API文档或服务端DTO定义

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

  /** 删除评价回复 响应类型 */
  export class DeleteProductsReviewsRepliesByReplyIdReviewIdProductIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 删除评价回复 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 DELETE /api/products/{productId}/reviews/{reviewId}/replies/{replyId} 操作的requestBody定义不完整
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
     * @ApiBody({ type: DeleteProductsReviewsRepliesByReplyIdReviewIdProductIdRequest })
     * async deletereviewreply(@Body() request: DeleteProductsReviewsRepliesByReplyIdReviewIdProductIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class DeleteProductsReviewsRepliesByReplyIdReviewIdProductIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 productservice_deletereviewreply 的API文档或服务端DTO定义

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

  /** 调整仓库库存 响应类型 */
  export class PatchProductsInventoryAdjustByWarehouseIdIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 调整仓库库存 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 PATCH /api/products/{id}/inventory/{warehouseId}/adjust 操作的requestBody定义不完整
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
     * @ApiBody({ type: PatchProductsInventoryAdjustByWarehouseIdIdRequest })
     * async adjustinventory(@Body() request: PatchProductsInventoryAdjustByWarehouseIdIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class PatchProductsInventoryAdjustByWarehouseIdIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 productservice_adjustinventory 的API文档或服务端DTO定义

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


  /** Productservice 模块客户端 */
  export class Client extends APIClient {  /**
   * 获取产品列表
   * 
   * @description Execute 获取产品列表 operation
   * @method GET
   * @path /api/products/
   * 
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<GetProductsResponse>} Returns API response result
   * 
   * @example
   * const result = await api.getProducts();
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async getProducts(...options: APIOption[]): Promise<GetProductsResponse> {

    return this.executeRequest<GetProductsRequest, GetProductsResponse>(
      HttpMethod.GET,
      '/api/products/',
      new GetProductsRequest(),
      GetProductsResponse,
      options
    );
  }

  /**
   * 获取特定品牌分类下的产品详情
   * 
   * @description Execute 获取特定品牌分类下的产品详情 operation
   * @method GET
   * @path /api/products/{categoryId}/brands/{brandId}/items/{itemId}
   * 
   * @param {string} itemId - Path parameter
   * @param {string} brandId - Path parameter
   * @param {string} categoryId - Path parameter
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<GetProductsBrandsItemsByItemIdBrandIdCategoryIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.getProductsBrandsItemsByItemIdBrandIdCategoryId(itemId, brandId, categoryId);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async getProductsBrandsItemsByItemIdBrandIdCategoryId(itemId: string, brandId: string, categoryId: string, ...options: APIOption[]): Promise<GetProductsBrandsItemsByItemIdBrandIdCategoryIdResponse> {

    return this.executeRequest<GetProductsBrandsItemsByItemIdBrandIdCategoryIdRequest, GetProductsBrandsItemsByItemIdBrandIdCategoryIdResponse>(
      HttpMethod.GET,
      `/api/products/${categoryId}/brands/${brandId}/items/${itemId}`,
      new GetProductsBrandsItemsByItemIdBrandIdCategoryIdRequest(),
      GetProductsBrandsItemsByItemIdBrandIdCategoryIdResponse,
      options
    );
  }

  /**
   * 更新产品分类
   * 
   * @description Execute 更新产品分类 operation
   * @method PUT
   * @path /api/products/{productId}/categories/{categoryId}
   * 
   * @param {string} categoryId - Path parameter
   * @param {string} productId - Path parameter
   * @param {UpdateProductsCategoriesByCategoryIdProductIdRequest} request - Request parameters
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<UpdateProductsCategoriesByCategoryIdProductIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.updateProductsCategoriesByCategoryIdProductId(categoryId, productId, request);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async updateProductsCategoriesByCategoryIdProductId(categoryId: string, productId: string, request: Productservice.UpdateProductsCategoriesByCategoryIdProductIdRequest, ...options: APIOption[]): Promise<UpdateProductsCategoriesByCategoryIdProductIdResponse> {
      await request.validate();

    return this.executeRequest<UpdateProductsCategoriesByCategoryIdProductIdRequest, UpdateProductsCategoriesByCategoryIdProductIdResponse>(
      HttpMethod.PUT,
      `/api/products/${productId}/categories/${categoryId}`,
      request,
      UpdateProductsCategoriesByCategoryIdProductIdResponse,
      options
    );
  }

  /**
   * 删除评价回复
   * 
   * @description Execute 删除评价回复 operation
   * @method DELETE
   * @path /api/products/{productId}/reviews/{reviewId}/replies/{replyId}
   * 
   * @param {string} replyId - Path parameter
   * @param {string} reviewId - Path parameter
   * @param {string} productId - Path parameter
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<DeleteProductsReviewsRepliesByReplyIdReviewIdProductIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.deleteProductsReviewsRepliesByReplyIdReviewIdProductId(replyId, reviewId, productId);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async deleteProductsReviewsRepliesByReplyIdReviewIdProductId(replyId: string, reviewId: string, productId: string, ...options: APIOption[]): Promise<DeleteProductsReviewsRepliesByReplyIdReviewIdProductIdResponse> {

    return this.executeRequest<DeleteProductsReviewsRepliesByReplyIdReviewIdProductIdRequest, DeleteProductsReviewsRepliesByReplyIdReviewIdProductIdResponse>(
      HttpMethod.DELETE,
      `/api/products/${productId}/reviews/${reviewId}/replies/${replyId}`,
      new DeleteProductsReviewsRepliesByReplyIdReviewIdProductIdRequest(),
      DeleteProductsReviewsRepliesByReplyIdReviewIdProductIdResponse,
      options
    );
  }

  /**
   * 调整仓库库存
   * 
   * @description Execute 调整仓库库存 operation
   * @method PATCH
   * @path /api/products/{id}/inventory/{warehouseId}/adjust
   * 
   * @param {string} warehouseId - Path parameter
   * @param {string} id - Path parameter
   * @param {PatchProductsInventoryAdjustByWarehouseIdIdRequest} request - Request parameters
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<PatchProductsInventoryAdjustByWarehouseIdIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.patchProductsInventoryAdjustByWarehouseIdId(warehouseId, id, request);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async patchProductsInventoryAdjustByWarehouseIdId(warehouseId: string, id: string, request: Productservice.PatchProductsInventoryAdjustByWarehouseIdIdRequest, ...options: APIOption[]): Promise<PatchProductsInventoryAdjustByWarehouseIdIdResponse> {
      await request.validate();

    return this.executeRequest<PatchProductsInventoryAdjustByWarehouseIdIdRequest, PatchProductsInventoryAdjustByWarehouseIdIdResponse>(
      HttpMethod.PATCH,
      `/api/products/${id}/inventory/${warehouseId}/adjust`,
      request,
      PatchProductsInventoryAdjustByWarehouseIdIdResponse,
      options
    );
  }


  }
}
