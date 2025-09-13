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

export namespace Analyticshandler {
  /** 获取分段周期报表 响应类型 */
  export class GetAnalyticsReportsPeriodsSegmentsBySegmentIdPeriodIdReportTypeResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 获取分段周期报表 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 GET /api/analytics/reports/{reportType}/periods/{periodId}/segments/{segmentId} 操作的requestBody定义不完整
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
     * @ApiBody({ type: GetAnalyticsReportsPeriodsSegmentsBySegmentIdPeriodIdReportTypeRequest })
     * async getsegmentedreport(@Body() request: GetAnalyticsReportsPeriodsSegmentsBySegmentIdPeriodIdReportTypeRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class GetAnalyticsReportsPeriodsSegmentsBySegmentIdPeriodIdReportTypeRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 analyticshandler_getsegmentedreport 的API文档或服务端DTO定义

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

  /** 群组对比分析 响应类型 */
  export class CreateAnalyticsCohortsMetricsComparisonsByMetricIdCohortTypeResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 群组对比分析 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 POST /api/analytics/cohorts/{cohortType}/metrics/{metricId}/comparisons 操作的requestBody定义不完整
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
     * @ApiBody({ type: CreateAnalyticsCohortsMetricsComparisonsByMetricIdCohortTypeRequest })
     * async analyzecohortcomparison(@Body() request: CreateAnalyticsCohortsMetricsComparisonsByMetricIdCohortTypeRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class CreateAnalyticsCohortsMetricsComparisonsByMetricIdCohortTypeRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 analyticshandler_analyzecohortcomparison 的API文档或服务端DTO定义

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

  /** 漏斗步骤维度分析 响应类型 */
  export class GetAnalyticsFunnelsStepsBreakdownsByDimensionIdStepIdFunnelIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 漏斗步骤维度分析 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 GET /api/analytics/funnels/{funnelId}/steps/{stepId}/breakdowns/{dimensionId} 操作的requestBody定义不完整
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
     * @ApiBody({ type: GetAnalyticsFunnelsStepsBreakdownsByDimensionIdStepIdFunnelIdRequest })
     * async getfunnelstepbreakdown(@Body() request: GetAnalyticsFunnelsStepsBreakdownsByDimensionIdStepIdFunnelIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class GetAnalyticsFunnelsStepsBreakdownsByDimensionIdStepIdFunnelIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 analyticshandler_getfunnelstepbreakdown 的API文档或服务端DTO定义

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


  /** Analyticshandler 模块客户端 */
  export class Client extends APIClient {  /**
   * 获取分段周期报表
   * 
   * @description Execute 获取分段周期报表 operation
   * @method GET
   * @path /api/analytics/reports/{reportType}/periods/{periodId}/segments/{segmentId}
   * 
   * @param {string} segmentId - Path parameter
   * @param {string} periodId - Path parameter
   * @param {string} reportType - Path parameter
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<GetAnalyticsReportsPeriodsSegmentsBySegmentIdPeriodIdReportTypeResponse>} Returns API response result
   * 
   * @example
   * const result = await api.getAnalyticsReportsPeriodsSegmentsBySegmentIdPeriodIdReportType(segmentId, periodId, reportType);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async getAnalyticsReportsPeriodsSegmentsBySegmentIdPeriodIdReportType(segmentId: string, periodId: string, reportType: string, ...options: APIOption[]): Promise<GetAnalyticsReportsPeriodsSegmentsBySegmentIdPeriodIdReportTypeResponse> {

    return this.executeRequest<GetAnalyticsReportsPeriodsSegmentsBySegmentIdPeriodIdReportTypeRequest, GetAnalyticsReportsPeriodsSegmentsBySegmentIdPeriodIdReportTypeResponse>(
      HttpMethod.GET,
      `/api/analytics/reports/${reportType}/periods/${periodId}/segments/${segmentId}`,
      new GetAnalyticsReportsPeriodsSegmentsBySegmentIdPeriodIdReportTypeRequest(),
      GetAnalyticsReportsPeriodsSegmentsBySegmentIdPeriodIdReportTypeResponse,
      options
    );
  }

  /**
   * 群组对比分析
   * 
   * @description Execute 群组对比分析 operation
   * @method POST
   * @path /api/analytics/cohorts/{cohortType}/metrics/{metricId}/comparisons
   * 
   * @param {string} metricId - Path parameter
   * @param {string} cohortType - Path parameter
   * @param {CreateAnalyticsCohortsMetricsComparisonsByMetricIdCohortTypeRequest} request - Request parameters
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<CreateAnalyticsCohortsMetricsComparisonsByMetricIdCohortTypeResponse>} Returns API response result
   * 
   * @example
   * const result = await api.createAnalyticsCohortsMetricsComparisonsByMetricIdCohortType(metricId, cohortType, request);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async createAnalyticsCohortsMetricsComparisonsByMetricIdCohortType(metricId: string, cohortType: string, request: Analyticshandler.CreateAnalyticsCohortsMetricsComparisonsByMetricIdCohortTypeRequest, ...options: APIOption[]): Promise<CreateAnalyticsCohortsMetricsComparisonsByMetricIdCohortTypeResponse> {
      await request.validate();

    return this.executeRequest<CreateAnalyticsCohortsMetricsComparisonsByMetricIdCohortTypeRequest, CreateAnalyticsCohortsMetricsComparisonsByMetricIdCohortTypeResponse>(
      HttpMethod.POST,
      `/api/analytics/cohorts/${cohortType}/metrics/${metricId}/comparisons`,
      request,
      CreateAnalyticsCohortsMetricsComparisonsByMetricIdCohortTypeResponse,
      options
    );
  }

  /**
   * 漏斗步骤维度分析
   * 
   * @description Execute 漏斗步骤维度分析 operation
   * @method GET
   * @path /api/analytics/funnels/{funnelId}/steps/{stepId}/breakdowns/{dimensionId}
   * 
   * @param {string} dimensionId - Path parameter
   * @param {string} stepId - Path parameter
   * @param {string} funnelId - Path parameter
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<GetAnalyticsFunnelsStepsBreakdownsByDimensionIdStepIdFunnelIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.getAnalyticsFunnelsStepsBreakdownsByDimensionIdStepIdFunnelId(dimensionId, stepId, funnelId);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async getAnalyticsFunnelsStepsBreakdownsByDimensionIdStepIdFunnelId(dimensionId: string, stepId: string, funnelId: string, ...options: APIOption[]): Promise<GetAnalyticsFunnelsStepsBreakdownsByDimensionIdStepIdFunnelIdResponse> {

    return this.executeRequest<GetAnalyticsFunnelsStepsBreakdownsByDimensionIdStepIdFunnelIdRequest, GetAnalyticsFunnelsStepsBreakdownsByDimensionIdStepIdFunnelIdResponse>(
      HttpMethod.GET,
      `/api/analytics/funnels/${funnelId}/steps/${stepId}/breakdowns/${dimensionId}`,
      new GetAnalyticsFunnelsStepsBreakdownsByDimensionIdStepIdFunnelIdRequest(),
      GetAnalyticsFunnelsStepsBreakdownsByDimensionIdStepIdFunnelIdResponse,
      options
    );
  }


  }
}
