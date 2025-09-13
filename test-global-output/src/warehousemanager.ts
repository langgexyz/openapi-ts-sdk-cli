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

export namespace Warehousemanager {
  /** 获取货架产品列表 响应类型 */
  export class GetWarehousesZonesShelvesProductsByShelfIdZoneIdWarehouseIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 获取货架产品列表 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 GET /api/warehouses/{warehouseId}/zones/{zoneId}/shelves/{shelfId}/products 操作的requestBody定义不完整
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
     * @ApiBody({ type: GetWarehousesZonesShelvesProductsByShelfIdZoneIdWarehouseIdRequest })
     * async getshelfproducts(@Body() request: GetWarehousesZonesShelvesProductsByShelfIdZoneIdWarehouseIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class GetWarehousesZonesShelvesProductsByShelfIdZoneIdWarehouseIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 warehousemanager_getshelfproducts 的API文档或服务端DTO定义

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

  /** 执行库存转移 响应类型 */
  export class UpdateWarehousesTransfersItemsDestinationsByDestWarehouseIdItemIdTransferIdWarehouseIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 执行库存转移 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 PUT /api/warehouses/{warehouseId}/transfers/{transferId}/items/{itemId}/destinations/{destWarehouseId} 操作的requestBody定义不完整
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
     * @ApiBody({ type: UpdateWarehousesTransfersItemsDestinationsByDestWarehouseIdItemIdTransferIdWarehouseIdRequest })
     * async executetransfer(@Body() request: UpdateWarehousesTransfersItemsDestinationsByDestWarehouseIdItemIdTransferIdWarehouseIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class UpdateWarehousesTransfersItemsDestinationsByDestWarehouseIdItemIdTransferIdWarehouseIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 warehousemanager_executetransfer 的API文档或服务端DTO定义

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

  /** 批量确认库存分配 响应类型 */
  export class CreateWarehousesBatchAllocationsConfirmationsByAllocationIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 批量确认库存分配 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 POST /api/warehouses/batch/allocations/{allocationId}/confirmations 操作的requestBody定义不完整
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
     * @ApiBody({ type: CreateWarehousesBatchAllocationsConfirmationsByAllocationIdRequest })
     * async batchconfirmallocations(@Body() request: CreateWarehousesBatchAllocationsConfirmationsByAllocationIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class CreateWarehousesBatchAllocationsConfirmationsByAllocationIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 warehousemanager_batchconfirmallocations 的API文档或服务端DTO定义

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

  /** 批量删除过期产品 响应类型 */
  export class DeleteWarehousesExpiredBatchesCategoriesByCategoryIdBatchIdWarehouseIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 批量删除过期产品 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 DELETE /api/warehouses/{warehouseId}/expired/batches/{batchId}/categories/{categoryId} 操作的requestBody定义不完整
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
     * @ApiBody({ type: DeleteWarehousesExpiredBatchesCategoriesByCategoryIdBatchIdWarehouseIdRequest })
     * async batchdeleteexpiredproducts(@Body() request: DeleteWarehousesExpiredBatchesCategoriesByCategoryIdBatchIdWarehouseIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class DeleteWarehousesExpiredBatchesCategoriesByCategoryIdBatchIdWarehouseIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 warehousemanager_batchdeleteexpiredproducts 的API文档或服务端DTO定义

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


  /** Warehousemanager 模块客户端 */
  export class Client extends APIClient {  /**
   * 获取货架产品列表
   * 
   * @description Execute 获取货架产品列表 operation
   * @method GET
   * @path /api/warehouses/{warehouseId}/zones/{zoneId}/shelves/{shelfId}/products
   * 
   * @param {string} shelfId - Path parameter
   * @param {string} zoneId - Path parameter
   * @param {string} warehouseId - Path parameter
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<GetWarehousesZonesShelvesProductsByShelfIdZoneIdWarehouseIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.getWarehousesZonesShelvesProductsByShelfIdZoneIdWarehouseId(shelfId, zoneId, warehouseId);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async getWarehousesZonesShelvesProductsByShelfIdZoneIdWarehouseId(shelfId: string, zoneId: string, warehouseId: string, ...options: APIOption[]): Promise<GetWarehousesZonesShelvesProductsByShelfIdZoneIdWarehouseIdResponse> {

    return this.executeRequest<GetWarehousesZonesShelvesProductsByShelfIdZoneIdWarehouseIdRequest, GetWarehousesZonesShelvesProductsByShelfIdZoneIdWarehouseIdResponse>(
      HttpMethod.GET,
      `/api/warehouses/${warehouseId}/zones/${zoneId}/shelves/${shelfId}/products`,
      new GetWarehousesZonesShelvesProductsByShelfIdZoneIdWarehouseIdRequest(),
      GetWarehousesZonesShelvesProductsByShelfIdZoneIdWarehouseIdResponse,
      options
    );
  }

  /**
   * 执行库存转移
   * 
   * @description Execute 执行库存转移 operation
   * @method PUT
   * @path /api/warehouses/{warehouseId}/transfers/{transferId}/items/{itemId}/destinations/{destWarehouseId}
   * 
   * @param {string} destWarehouseId - Path parameter
   * @param {string} itemId - Path parameter
   * @param {string} transferId - Path parameter
   * @param {string} warehouseId - Path parameter
   * @param {UpdateWarehousesTransfersItemsDestinationsByDestWarehouseIdItemIdTransferIdWarehouseIdRequest} request - Request parameters
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<UpdateWarehousesTransfersItemsDestinationsByDestWarehouseIdItemIdTransferIdWarehouseIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.updateWarehousesTransfersItemsDestinationsByDestWarehouseIdItemIdTransferIdWarehouseId(destWarehouseId, itemId, transferId, warehouseId, request);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async updateWarehousesTransfersItemsDestinationsByDestWarehouseIdItemIdTransferIdWarehouseId(destWarehouseId: string, itemId: string, transferId: string, warehouseId: string, request: Warehousemanager.UpdateWarehousesTransfersItemsDestinationsByDestWarehouseIdItemIdTransferIdWarehouseIdRequest, ...options: APIOption[]): Promise<UpdateWarehousesTransfersItemsDestinationsByDestWarehouseIdItemIdTransferIdWarehouseIdResponse> {
      await request.validate();

    return this.executeRequest<UpdateWarehousesTransfersItemsDestinationsByDestWarehouseIdItemIdTransferIdWarehouseIdRequest, UpdateWarehousesTransfersItemsDestinationsByDestWarehouseIdItemIdTransferIdWarehouseIdResponse>(
      HttpMethod.PUT,
      `/api/warehouses/${warehouseId}/transfers/${transferId}/items/${itemId}/destinations/${destWarehouseId}`,
      request,
      UpdateWarehousesTransfersItemsDestinationsByDestWarehouseIdItemIdTransferIdWarehouseIdResponse,
      options
    );
  }

  /**
   * 批量确认库存分配
   * 
   * @description Execute 批量确认库存分配 operation
   * @method POST
   * @path /api/warehouses/batch/allocations/{allocationId}/confirmations
   * 
   * @param {string} allocationId - Path parameter
   * @param {CreateWarehousesBatchAllocationsConfirmationsByAllocationIdRequest} request - Request parameters
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<CreateWarehousesBatchAllocationsConfirmationsByAllocationIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.createWarehousesBatchAllocationsConfirmationsByAllocationId(allocationId, request);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async createWarehousesBatchAllocationsConfirmationsByAllocationId(allocationId: string, request: Warehousemanager.CreateWarehousesBatchAllocationsConfirmationsByAllocationIdRequest, ...options: APIOption[]): Promise<CreateWarehousesBatchAllocationsConfirmationsByAllocationIdResponse> {
      await request.validate();

    return this.executeRequest<CreateWarehousesBatchAllocationsConfirmationsByAllocationIdRequest, CreateWarehousesBatchAllocationsConfirmationsByAllocationIdResponse>(
      HttpMethod.POST,
      `/api/warehouses/batch/allocations/${allocationId}/confirmations`,
      request,
      CreateWarehousesBatchAllocationsConfirmationsByAllocationIdResponse,
      options
    );
  }

  /**
   * 批量删除过期产品
   * 
   * @description Execute 批量删除过期产品 operation
   * @method DELETE
   * @path /api/warehouses/{warehouseId}/expired/batches/{batchId}/categories/{categoryId}
   * 
   * @param {string} categoryId - Path parameter
   * @param {string} batchId - Path parameter
   * @param {string} warehouseId - Path parameter
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<DeleteWarehousesExpiredBatchesCategoriesByCategoryIdBatchIdWarehouseIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.deleteWarehousesExpiredBatchesCategoriesByCategoryIdBatchIdWarehouseId(categoryId, batchId, warehouseId);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async deleteWarehousesExpiredBatchesCategoriesByCategoryIdBatchIdWarehouseId(categoryId: string, batchId: string, warehouseId: string, ...options: APIOption[]): Promise<DeleteWarehousesExpiredBatchesCategoriesByCategoryIdBatchIdWarehouseIdResponse> {

    return this.executeRequest<DeleteWarehousesExpiredBatchesCategoriesByCategoryIdBatchIdWarehouseIdRequest, DeleteWarehousesExpiredBatchesCategoriesByCategoryIdBatchIdWarehouseIdResponse>(
      HttpMethod.DELETE,
      `/api/warehouses/${warehouseId}/expired/batches/${batchId}/categories/${categoryId}`,
      new DeleteWarehousesExpiredBatchesCategoriesByCategoryIdBatchIdWarehouseIdRequest(),
      DeleteWarehousesExpiredBatchesCategoriesByCategoryIdBatchIdWarehouseIdResponse,
      options
    );
  }


  }
}
