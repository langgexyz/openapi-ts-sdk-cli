/**
 * ⚠️  此文件由 openapi-ts-sdk-cli 自动生成，请勿手动修改！
 * 
 * 📅 生成时间: 2025-09-13T06:00:45.037Z
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

export namespace Admindashboard {
  /** 获取系统监控告警升级信息 响应类型 */
  export class GetAdminSystemsMonitoringAlertsEscalationsByAlertIdMetricTypeSystemIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 获取系统监控告警升级信息 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 GET /admin/systems/{systemId}/monitoring/{metricType}/alerts/{alertId}/escalations 操作的requestBody定义不完整
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
     * @ApiBody({ type: GetAdminSystemsMonitoringAlertsEscalationsByAlertIdMetricTypeSystemIdRequest })
     * async getalertescalations(@Body() request: GetAdminSystemsMonitoringAlertsEscalationsByAlertIdMetricTypeSystemIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class GetAdminSystemsMonitoringAlertsEscalationsByAlertIdMetricTypeSystemIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 admindashboard_getalertescalations 的API文档或服务端DTO定义

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

  /** 执行用户账户暂停 响应类型 */
  export class CreateAdminUsersAccountsSuspensionsBySuspensionTypeAccountIdUserIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 执行用户账户暂停 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 POST /admin/users/{userId}/accounts/{accountId}/suspensions/{suspensionType} 操作的requestBody定义不完整
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
     * @ApiBody({ type: CreateAdminUsersAccountsSuspensionsBySuspensionTypeAccountIdUserIdRequest })
     * async executeaccountsuspension(@Body() request: CreateAdminUsersAccountsSuspensionsBySuspensionTypeAccountIdUserIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class CreateAdminUsersAccountsSuspensionsBySuspensionTypeAccountIdUserIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 admindashboard_executeaccountsuspension 的API文档或服务端DTO定义

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

  /** 批量清除缓存键 响应类型 */
  export class DeleteAdminCacheNamespacesKeysByKeyPatternNamespaceCacheTypeResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 批量清除缓存键 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 DELETE /admin/cache/{cacheType}/namespaces/{namespace}/keys/{keyPattern} 操作的requestBody定义不完整
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
     * @ApiBody({ type: DeleteAdminCacheNamespacesKeysByKeyPatternNamespaceCacheTypeRequest })
     * async batchclearcachekeys(@Body() request: DeleteAdminCacheNamespacesKeysByKeyPatternNamespaceCacheTypeRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class DeleteAdminCacheNamespacesKeysByKeyPatternNamespaceCacheTypeRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 admindashboard_batchclearcachekeys 的API文档或服务端DTO定义

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


  /** Admindashboard 模块客户端 */
  export class Client extends APIClient {  /**
   * 获取系统监控告警升级信息
   * 
   * @description Execute 获取系统监控告警升级信息 operation
   * @method GET
   * @path /admin/systems/{systemId}/monitoring/{metricType}/alerts/{alertId}/escalations
   * 
   * @param {string} alertId - Path parameter
   * @param {string} metricType - Path parameter
   * @param {string} systemId - Path parameter
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<GetAdminSystemsMonitoringAlertsEscalationsByAlertIdMetricTypeSystemIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.getAdminSystemsMonitoringAlertsEscalationsByAlertIdMetricTypeSystemId(alertId, metricType, systemId);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async getAdminSystemsMonitoringAlertsEscalationsByAlertIdMetricTypeSystemId(alertId: string, metricType: string, systemId: string, ...options: APIOption[]): Promise<GetAdminSystemsMonitoringAlertsEscalationsByAlertIdMetricTypeSystemIdResponse> {

    return this.executeRequest<GetAdminSystemsMonitoringAlertsEscalationsByAlertIdMetricTypeSystemIdRequest, GetAdminSystemsMonitoringAlertsEscalationsByAlertIdMetricTypeSystemIdResponse>(
      HttpMethod.GET,
      `/admin/systems/${systemId}/monitoring/${metricType}/alerts/${alertId}/escalations`,
      new GetAdminSystemsMonitoringAlertsEscalationsByAlertIdMetricTypeSystemIdRequest(),
      GetAdminSystemsMonitoringAlertsEscalationsByAlertIdMetricTypeSystemIdResponse,
      options
    );
  }

  /**
   * 执行用户账户暂停
   * 
   * @description Execute 执行用户账户暂停 operation
   * @method POST
   * @path /admin/users/{userId}/accounts/{accountId}/suspensions/{suspensionType}
   * 
   * @param {string} suspensionType - Path parameter
   * @param {string} accountId - Path parameter
   * @param {string} userId - Path parameter
   * @param {CreateAdminUsersAccountsSuspensionsBySuspensionTypeAccountIdUserIdRequest} request - Request parameters
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<CreateAdminUsersAccountsSuspensionsBySuspensionTypeAccountIdUserIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.createAdminUsersAccountsSuspensionsBySuspensionTypeAccountIdUserId(suspensionType, accountId, userId, request);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async createAdminUsersAccountsSuspensionsBySuspensionTypeAccountIdUserId(suspensionType: string, accountId: string, userId: string, request: Admindashboard.CreateAdminUsersAccountsSuspensionsBySuspensionTypeAccountIdUserIdRequest, ...options: APIOption[]): Promise<CreateAdminUsersAccountsSuspensionsBySuspensionTypeAccountIdUserIdResponse> {
      await request.validate();

    return this.executeRequest<CreateAdminUsersAccountsSuspensionsBySuspensionTypeAccountIdUserIdRequest, CreateAdminUsersAccountsSuspensionsBySuspensionTypeAccountIdUserIdResponse>(
      HttpMethod.POST,
      `/admin/users/${userId}/accounts/${accountId}/suspensions/${suspensionType}`,
      request,
      CreateAdminUsersAccountsSuspensionsBySuspensionTypeAccountIdUserIdResponse,
      options
    );
  }

  /**
   * 批量清除缓存键
   * 
   * @description Execute 批量清除缓存键 operation
   * @method DELETE
   * @path /admin/cache/{cacheType}/namespaces/{namespace}/keys/{keyPattern}
   * 
   * @param {string} keyPattern - Path parameter
   * @param {string} namespace - Path parameter
   * @param {string} cacheType - Path parameter
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<DeleteAdminCacheNamespacesKeysByKeyPatternNamespaceCacheTypeResponse>} Returns API response result
   * 
   * @example
   * const result = await api.deleteAdminCacheNamespacesKeysByKeyPatternNamespaceCacheType(keyPattern, namespace, cacheType);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async deleteAdminCacheNamespacesKeysByKeyPatternNamespaceCacheType(keyPattern: string, namespace: string, cacheType: string, ...options: APIOption[]): Promise<DeleteAdminCacheNamespacesKeysByKeyPatternNamespaceCacheTypeResponse> {

    return this.executeRequest<DeleteAdminCacheNamespacesKeysByKeyPatternNamespaceCacheTypeRequest, DeleteAdminCacheNamespacesKeysByKeyPatternNamespaceCacheTypeResponse>(
      HttpMethod.DELETE,
      `/admin/cache/${cacheType}/namespaces/${namespace}/keys/${keyPattern}`,
      new DeleteAdminCacheNamespacesKeysByKeyPatternNamespaceCacheTypeRequest(),
      DeleteAdminCacheNamespacesKeysByKeyPatternNamespaceCacheTypeResponse,
      options
    );
  }


  }
}
