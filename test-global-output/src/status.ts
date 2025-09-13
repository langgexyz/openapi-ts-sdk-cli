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

export namespace Status {
  /** 状态检查 */
  export class Response {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 组件健康检查结果 响应类型 */
  export class GetHealthComponentsChecksResultsByResultIdCheckIdComponentIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 组件健康检查结果 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 GET /health/components/{componentId}/checks/{checkId}/results/{resultId} 操作的requestBody定义不完整
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
     * @ApiBody({ type: GetHealthComponentsChecksResultsByResultIdCheckIdComponentIdRequest })
     * async getcomponenthealthresult(@Body() request: GetHealthComponentsChecksResultsByResultIdCheckIdComponentIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class GetHealthComponentsChecksResultsByResultIdCheckIdComponentIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 status_getcomponenthealthresult 的API文档或服务端DTO定义

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

  /** 提交事件状态更新 响应类型 */
  export class CreateMonitoringIncidentsUpdatesByUpdateIdIncidentIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 提交事件状态更新 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 POST /monitoring/incidents/{incidentId}/updates/{updateId} 操作的requestBody定义不完整
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
     * @ApiBody({ type: CreateMonitoringIncidentsUpdatesByUpdateIdIncidentIdRequest })
     * async submitincidentupdate(@Body() request: CreateMonitoringIncidentsUpdatesByUpdateIdIncidentIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class CreateMonitoringIncidentsUpdatesByUpdateIdIncidentIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 status_submitincidentupdate 的API文档或服务端DTO定义

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


  /** Status 模块客户端 */
  export class Client extends APIClient {  /**
   * 组件健康检查结果
   * 
   * @description Execute 组件健康检查结果 operation
   * @method GET
   * @path /health/components/{componentId}/checks/{checkId}/results/{resultId}
   * 
   * @param {string} resultId - Path parameter
   * @param {string} checkId - Path parameter
   * @param {string} componentId - Path parameter
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<GetHealthComponentsChecksResultsByResultIdCheckIdComponentIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.getHealthComponentsChecksResultsByResultIdCheckIdComponentId(resultId, checkId, componentId);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async getHealthComponentsChecksResultsByResultIdCheckIdComponentId(resultId: string, checkId: string, componentId: string, ...options: APIOption[]): Promise<GetHealthComponentsChecksResultsByResultIdCheckIdComponentIdResponse> {

    return this.executeRequest<GetHealthComponentsChecksResultsByResultIdCheckIdComponentIdRequest, GetHealthComponentsChecksResultsByResultIdCheckIdComponentIdResponse>(
      HttpMethod.GET,
      `/health/components/${componentId}/checks/${checkId}/results/${resultId}`,
      new GetHealthComponentsChecksResultsByResultIdCheckIdComponentIdRequest(),
      GetHealthComponentsChecksResultsByResultIdCheckIdComponentIdResponse,
      options
    );
  }

  /**
   * 提交事件状态更新
   * 
   * @description Execute 提交事件状态更新 operation
   * @method POST
   * @path /monitoring/incidents/{incidentId}/updates/{updateId}
   * 
   * @param {string} updateId - Path parameter
   * @param {string} incidentId - Path parameter
   * @param {CreateMonitoringIncidentsUpdatesByUpdateIdIncidentIdRequest} request - Request parameters
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<CreateMonitoringIncidentsUpdatesByUpdateIdIncidentIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.createMonitoringIncidentsUpdatesByUpdateIdIncidentId(updateId, incidentId, request);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async createMonitoringIncidentsUpdatesByUpdateIdIncidentId(updateId: string, incidentId: string, request: Status.CreateMonitoringIncidentsUpdatesByUpdateIdIncidentIdRequest, ...options: APIOption[]): Promise<CreateMonitoringIncidentsUpdatesByUpdateIdIncidentIdResponse> {
      await request.validate();

    return this.executeRequest<CreateMonitoringIncidentsUpdatesByUpdateIdIncidentIdRequest, CreateMonitoringIncidentsUpdatesByUpdateIdIncidentIdResponse>(
      HttpMethod.POST,
      `/monitoring/incidents/${incidentId}/updates/${updateId}`,
      request,
      CreateMonitoringIncidentsUpdatesByUpdateIdIncidentIdResponse,
      options
    );
  }


  }
}
