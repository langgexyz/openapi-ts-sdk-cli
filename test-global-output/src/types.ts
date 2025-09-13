// 共享类型定义和基础 API 客户端

import { HttpBuilder, HttpMethod } from 'openapi-ts-sdk';
import { Json, ClassArray } from 'ts-json';

// API 配置接口
export interface APIConfig {
  uri: string;           // 请求 URI（每个方法都有默认值，可通过 withUri 覆盖）
  headers: Record<string, string>;  // 请求 headers（默认包含 Content-Type）
}

// 函数式选项类型
export type APIOption = (config: APIConfig) => void;

// 选项构造函数
export const withUri = (uri: string): APIOption => (config) => {
  config.uri = uri;
};

export const withHeaders = (headers: Record<string, string>): APIOption => (config) => {
  config.headers = { ...config.headers, ...headers };
};

export const withHeader = (key: string, value: string): APIOption => (config) => {
  config.headers = { ...config.headers, [key]: value };
};

// 组合选项
export const combineOptions = (...options: APIOption[]): APIOption => (config) => {
  options.forEach(option => option(config));
};

// 基础 API 客户端类
export abstract class APIClient {
  protected httpBuilder: HttpBuilder;

  constructor(httpBuilder: HttpBuilder) {
    this.httpBuilder = httpBuilder;
  }

  /**
   * 通用参数验证方法
   * @protected
   */
  protected validateRequest<T = unknown>(request: T): void {
    if (!request) {
      throw new Error('参数 request 是必需的');
    }
    
    if (typeof request !== 'object') {
      throw new Error('参数 request 必须是对象类型');
    }
  }

  /**
   * 通用请求处理方法 - 参考PostJsonNoToken设计，但保持异常抛出模式
   * @protected
   */
  protected async executeRequest<TRequest = unknown, TResponse = unknown>(
    method: HttpMethod,
    path: string,
    request: TRequest,
    responseType: {new(...args:any[]): TResponse} | TResponse,
    options: APIOption[] = []
  ): Promise<TResponse> {
    // 创建响应类型实例用于反序列化
    if (typeof responseType === "function") {
      responseType = new (responseType as any)()
    }
    
    // 创建默认配置
    const config: APIConfig = {
      uri: path,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    // 应用所有选项
    options.forEach(option => option(config));
    
    // 构建 HTTP 请求
    const httpBuilder = this.httpBuilder
      .setUri(config.uri)
      .setMethod(method);
    
    // 添加 headers
    Object.entries(config.headers).forEach(([key, value]) => {
      httpBuilder.addHeader(key, value);
    });
    
    // 序列化请求体（如果有）
    if (request) {
      const requestJson = new Json().toJson(request);
      httpBuilder.setContent(requestJson);
    }
    
    const http = httpBuilder.build();
    const [response, error] = await http.send();
    
    if (error) {
      throw error;
    }
    
    if (response === "") {
      throw new Error("response is empty");
    }
    
    // 使用ts-json进行反序列化
    const [result, parseError] = new Json().fromJson(response, responseType);
    if (parseError) {
      throw parseError;
    }
    return result;
  }
}
