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

export namespace Publicendpoint {
  /** 获取商品推荐 响应类型 */
  export class GetPublicCatalogsItemsRecommendationsByAlgorithmTypeItemIdCategoryIdResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 获取商品推荐 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 GET /public/catalogs/{categoryId}/items/{itemId}/recommendations/{algorithmType} 操作的requestBody定义不完整
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
     * @ApiBody({ type: GetPublicCatalogsItemsRecommendationsByAlgorithmTypeItemIdCategoryIdRequest })
     * async getitemrecommendations(@Body() request: GetPublicCatalogsItemsRecommendationsByAlgorithmTypeItemIdCategoryIdRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class GetPublicCatalogsItemsRecommendationsByAlgorithmTypeItemIdCategoryIdRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 publicendpoint_getitemrecommendations 的API文档或服务端DTO定义

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

  /** 提交公开反馈 响应类型 */
  export class CreatePublicFeedbackCategoriesSubmissionsByCategoryIdFeedbackTypeResponse {
    @IsOptional()
    data?: unknown; // 响应数据
  }

  /** 
   * 提交公开反馈 请求类型
   * 
   * ⚠️  注意：此请求类型定义不完整
   * 
   * 🔍 缺失原因：
   * • OpenAPI规范中 POST /public/feedback/{feedbackType}/categories/{categoryId}/submissions 操作的requestBody定义不完整
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
     * @ApiBody({ type: CreatePublicFeedbackCategoriesSubmissionsByCategoryIdFeedbackTypeRequest })
     * async submitpublicfeedback(@Body() request: CreatePublicFeedbackCategoriesSubmissionsByCategoryIdFeedbackTypeRequest) {
     *   // 实现逻辑
     * }
     * ```
     * 
     * 💡 客户端开发者：
     * • 此类型暂时为空对象，请根据实际API文档使用
     * • 服务器端完善后重新生成SDK即可获得完整类型定义
   */
  export class CreatePublicFeedbackCategoriesSubmissionsByCategoryIdFeedbackTypeRequest {
    // TODO: 请根据API需求添加具体的属性定义
    // 可以参考 publicendpoint_submitpublicfeedback 的API文档或服务端DTO定义

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


  /** Publicendpoint 模块客户端 */
  export class Client extends APIClient {  /**
   * 获取商品推荐
   * 
   * @description Execute 获取商品推荐 operation
   * @method GET
   * @path /public/catalogs/{categoryId}/items/{itemId}/recommendations/{algorithmType}
   * 
   * @param {string} algorithmType - Path parameter
   * @param {string} itemId - Path parameter
   * @param {string} categoryId - Path parameter
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<GetPublicCatalogsItemsRecommendationsByAlgorithmTypeItemIdCategoryIdResponse>} Returns API response result
   * 
   * @example
   * const result = await api.getPublicCatalogsItemsRecommendationsByAlgorithmTypeItemIdCategoryId(algorithmType, itemId, categoryId);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async getPublicCatalogsItemsRecommendationsByAlgorithmTypeItemIdCategoryId(algorithmType: string, itemId: string, categoryId: string, ...options: APIOption[]): Promise<GetPublicCatalogsItemsRecommendationsByAlgorithmTypeItemIdCategoryIdResponse> {

    return this.executeRequest<GetPublicCatalogsItemsRecommendationsByAlgorithmTypeItemIdCategoryIdRequest, GetPublicCatalogsItemsRecommendationsByAlgorithmTypeItemIdCategoryIdResponse>(
      HttpMethod.GET,
      `/public/catalogs/${categoryId}/items/${itemId}/recommendations/${algorithmType}`,
      new GetPublicCatalogsItemsRecommendationsByAlgorithmTypeItemIdCategoryIdRequest(),
      GetPublicCatalogsItemsRecommendationsByAlgorithmTypeItemIdCategoryIdResponse,
      options
    );
  }

  /**
   * 提交公开反馈
   * 
   * @description Execute 提交公开反馈 operation
   * @method POST
   * @path /public/feedback/{feedbackType}/categories/{categoryId}/submissions
   * 
   * @param {string} categoryId - Path parameter
   * @param {string} feedbackType - Path parameter
   * @param {CreatePublicFeedbackCategoriesSubmissionsByCategoryIdFeedbackTypeRequest} request - Request parameters
   * @param {...APIOption} options - Functional option parameters
   * @returns {Promise<CreatePublicFeedbackCategoriesSubmissionsByCategoryIdFeedbackTypeResponse>} Returns API response result
   * 
   * @example
   * const result = await api.createPublicFeedbackCategoriesSubmissionsByCategoryIdFeedbackType(categoryId, feedbackType, request);
   * 
   * @throws {Error} Throws error when request fails or parameter validation fails
   */
  async createPublicFeedbackCategoriesSubmissionsByCategoryIdFeedbackType(categoryId: string, feedbackType: string, request: Publicendpoint.CreatePublicFeedbackCategoriesSubmissionsByCategoryIdFeedbackTypeRequest, ...options: APIOption[]): Promise<CreatePublicFeedbackCategoriesSubmissionsByCategoryIdFeedbackTypeResponse> {
      await request.validate();

    return this.executeRequest<CreatePublicFeedbackCategoriesSubmissionsByCategoryIdFeedbackTypeRequest, CreatePublicFeedbackCategoriesSubmissionsByCategoryIdFeedbackTypeResponse>(
      HttpMethod.POST,
      `/public/feedback/${feedbackType}/categories/${categoryId}/submissions`,
      request,
      CreatePublicFeedbackCategoriesSubmissionsByCategoryIdFeedbackTypeResponse,
      options
    );
  }


  }
}
