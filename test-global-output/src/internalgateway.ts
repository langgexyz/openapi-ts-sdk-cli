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

export namespace Internalgateway {
  /** 内部服务健康依赖检查 响应类型 */
  export class GetInternalServicesHealthDependenciesByDependencyIdCheckTypeServiceIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 内部服务健康依赖检查 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 GET /internal/services/{serviceId}/health/{checkType}/dependencies/{dependencyId} 操作的requestBody定义不完整
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
     * @ApiBody({ type: GetInternalServicesHealthDependenciesByDependencyIdCheckTypeServiceIdRequest })
     * async checkservicedependencyhealth(@Body() request: GetInternalServicesHealthDependenciesByDependencyIdCheckTypeServiceIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class GetInternalServicesHealthDependenciesByDependencyIdCheckTypeServiceIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 internalgateway_checkservicedependencyhealth 的API文档或服务端DTO定义

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

  /** 动态调整路由权重 响应类型 */
  export class CreateInternalRoutingDestinationsWeightsByWeightTypeDestinationIdRouteIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 动态调整路由权重 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 POST /internal/routing/{routeId}/destinations/{destinationId}/weights/{weightType} 操作的requestBody定义不完整
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
     * @ApiBody({ type: CreateInternalRoutingDestinationsWeightsByWeightTypeDestinationIdRouteIdRequest })
     * async adjustrouteweight(@Body() request: CreateInternalRoutingDestinationsWeightsByWeightTypeDestinationIdRouteIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class CreateInternalRoutingDestinationsWeightsByWeightTypeDestinationIdRouteIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 internalgateway_adjustrouteweight 的API文档或服务端DTO定义

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

  /** 更新指标聚合窗口 响应类型 */
  export class PatchInternalMetricsAggregationsWindowsByWindowIdAggregationIdMetricTypeResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 更新指标聚合窗口 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 PATCH /internal/metrics/{metricType}/aggregations/{aggregationId}/windows/{windowId} 操作的requestBody定义不完整
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
     * @ApiBody({ type: PatchInternalMetricsAggregationsWindowsByWindowIdAggregationIdMetricTypeRequest })
     * async updatemetricaggregationwindow(@Body() request: PatchInternalMetricsAggregationsWindowsByWindowIdAggregationIdMetricTypeRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class PatchInternalMetricsAggregationsWindowsByWindowIdAggregationIdMetricTypeRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 internalgateway_updatemetricaggregationwindow 的API文档或服务端DTO定义

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


  /** Internalgateway 模块客户端 */
  export class Client extends APIClient {  /**
   * 内部服务健康依赖检查
   * 
   * @description Execute 内部服务健康依赖检查 operation
   * @method GET
   * @path /internal/services/{serviceId}/health/{checkType}/dependencies/{dependencyId}
   * 
   * @param {string} dependencyId - Path parameter
   * @param {string} checkType - Path parameter
   * @param {string} serviceId - Path parameter
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<GetInternalServicesHealthDependenciesByDependencyIdCheckTypeServiceIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.getInternalServicesHealthDependenciesByDependencyIdCheckTypeServiceId(dependencyId, checkType, serviceId);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async getInternalServicesHealthDependenciesByDependencyIdCheckTypeServiceId(dependencyId: string, checkType: string, serviceId: string, ...options: APIOption[]): Promise<GetInternalServicesHealthDependenciesByDependencyIdCheckTypeServiceIdResponse> {

    return this.executeRequest<GetInternalServicesHealthDependenciesByDependencyIdCheckTypeServiceIdRequest, GetInternalServicesHealthDependenciesByDependencyIdCheckTypeServiceIdResponse>(
      HttpMethod.GET,
      `/internal/services/${serviceId}/health/${checkType}/dependencies/${dependencyId}`,
      new GetInternalServicesHealthDependenciesByDependencyIdCheckTypeServiceIdRequest(),
      GetInternalServicesHealthDependenciesByDependencyIdCheckTypeServiceIdResponse,
      options
    );
  }

  /**
   * 动态调整路由权重
   * 
   * @description Execute 动态调整路由权重 operation
   * @method POST
   * @path /internal/routing/{routeId}/destinations/{destinationId}/weights/{weightType}
   * 
   * @param {string} weightType - Path parameter
   * @param {string} destinationId - Path parameter
   * @param {string} routeId - Path parameter
   * @param {CreateInternalRoutingDestinationsWeightsByWeightTypeDestinationIdRouteIdRequest} request - Request parameters
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<CreateInternalRoutingDestinationsWeightsByWeightTypeDestinationIdRouteIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.createInternalRoutingDestinationsWeightsByWeightTypeDestinationIdRouteId(weightType, destinationId, routeId, request);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async createInternalRoutingDestinationsWeightsByWeightTypeDestinationIdRouteId(weightType: string, destinationId: string, routeId: string, request: Internalgateway.CreateInternalRoutingDestinationsWeightsByWeightTypeDestinationIdRouteIdRequest, ...options: APIOption[]): Promise<CreateInternalRoutingDestinationsWeightsByWeightTypeDestinationIdRouteIdResponse> {
      await request.validate();

    return this.executeRequest<CreateInternalRoutingDestinationsWeightsByWeightTypeDestinationIdRouteIdRequest, CreateInternalRoutingDestinationsWeightsByWeightTypeDestinationIdRouteIdResponse>(
      HttpMethod.POST,
      `/internal/routing/${routeId}/destinations/${destinationId}/weights/${weightType}`,
      request,
      CreateInternalRoutingDestinationsWeightsByWeightTypeDestinationIdRouteIdResponse,
      options
    );
  }

  /**
   * 更新指标聚合窗口
   * 
   * @description Execute 更新指标聚合窗口 operation
   * @method PATCH
   * @path /internal/metrics/{metricType}/aggregations/{aggregationId}/windows/{windowId}
   * 
   * @param {string} windowId - Path parameter
   * @param {string} aggregationId - Path parameter
   * @param {string} metricType - Path parameter
   * @param {PatchInternalMetricsAggregationsWindowsByWindowIdAggregationIdMetricTypeRequest} request - Request parameters
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<PatchInternalMetricsAggregationsWindowsByWindowIdAggregationIdMetricTypeResponse>} Returns API response result
   * 
   * @example
   * const result = await api.patchInternalMetricsAggregationsWindowsByWindowIdAggregationIdMetricType(windowId, aggregationId, metricType, request);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async patchInternalMetricsAggregationsWindowsByWindowIdAggregationIdMetricType(windowId: string, aggregationId: string, metricType: string, request: Internalgateway.PatchInternalMetricsAggregationsWindowsByWindowIdAggregationIdMetricTypeRequest, ...options: APIOption[]): Promise<PatchInternalMetricsAggregationsWindowsByWindowIdAggregationIdMetricTypeResponse> {
      await request.validate();

    return this.executeRequest<PatchInternalMetricsAggregationsWindowsByWindowIdAggregationIdMetricTypeRequest, PatchInternalMetricsAggregationsWindowsByWindowIdAggregationIdMetricTypeResponse>(
      HttpMethod.PATCH,
      `/internal/metrics/${metricType}/aggregations/${aggregationId}/windows/${windowId}`,
      request,
      PatchInternalMetricsAggregationsWindowsByWindowIdAggregationIdMetricTypeResponse,
      options
    );
  }


  }
}
