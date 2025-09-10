#!/usr/bin/env node

/**
 * 简单使用示例 - 演示如何调用生成的 API 客户端
 */

// 模拟 HttpBuilder 和生成的 API 客户端
class MockHttpBuilder {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.uri = '';
    this.method = '';
    this.headers = {};
    this.content = '';
  }

  setUri(uri) {
    this.uri = uri;
    return this;
  }

  setMethod(method) {
    this.method = method;
    return this;
  }

  addHeader(key, value) {
    this.headers[key] = value;
    return this;
  }

  setContent(content) {
    this.content = content;
    return this;
  }

  build() {
    return {
      send: async () => {
        console.log(`📡 HTTP ${this.method} ${this.baseUrl}${this.uri}`);
        console.log(`📝 Headers:`, this.headers);
        if (this.content) {
          console.log(`📦 Body:`, this.content);
        }
        
        // 模拟响应
        const mockResponse = JSON.stringify({
          code: 200,
          message: 'success',
          data: [
            {
              tweetId: '1234567890',
              text: 'This is a bullish tweet about $TOKEN 🚀',
              author: '@crypto_trader',
              createdAt: '2024-01-01T00:00:00Z'
            }
          ]
        });
        
        return [mockResponse, null]; // [response, error]
      }
    };
  }
}

// 模拟生成的 API 客户端类
class DexxBigVCallClient {
  constructor(httpBuilder) {
    this.httpBuilder = httpBuilder;
  }

  async searchTimeline(request) {
    const http = this.httpBuilder
      .setUri('/api/bigVCall/searchTimeline')
      .setMethod('POST')
      .addHeader('Content-Type', 'application/json')
      .setContent(JSON.stringify(request))
      .build();

    const [response, error] = await http.send();
    
    if (error) {
      throw error;
    }
    
    return JSON.parse(response);
  }

  async translate(request) {
    const http = this.httpBuilder
      .setUri('/api/bigVCall/translate')
      .setMethod('POST')
      .addHeader('Content-Type', 'application/json')
      .setContent(JSON.stringify(request))
      .build();

    const [response, error] = await http.send();
    
    if (error) {
      throw error;
    }
    
    return JSON.parse(response);
  }
}

async function main() {
  console.log('🚀 ts-sdk-client-generator 使用示例\n');

  // 1. 创建 HTTP Builder
  console.log('1️⃣ 创建 HTTP Builder');
  const httpBuilder = new MockHttpBuilder('https://api.example.com');
  console.log('✅ HTTP Builder 创建成功\n');

  // 2. 创建 API 客户端
  console.log('2️⃣ 创建 API 客户端');
  const client = new DexxBigVCallClient(httpBuilder);
  console.log('✅ DexxBigVCallClient 创建成功\n');

  // 3. 调用 API 方法
  console.log('3️⃣ 调用 API 方法');
  
  try {
    // 调用查询代币推文 API
    console.log('🔍 查询代币推文...');
    const timeline = await client.searchTimeline({ 
      caAddress: '0x1234567890abcdef' 
    });
    console.log('✅ 查询成功:', timeline.data[0].text);
    console.log('');

    // 调用翻译 API
    console.log('🌐 翻译文本...');
    const translation = await client.translate({ 
      content: 'This is bullish!' 
    });
    console.log('✅ 翻译成功\n');

    console.log('🎉 所有 API 调用成功完成！');

  } catch (error) {
    console.error('❌ API 调用失败:', error);
  }

  console.log('\n📖 如何在实际项目中使用:');
  console.log('   1. 运行: ./dist/cli.js generate -i ../openapi.json -o ./generated');
  console.log('   2. 安装依赖: cd ./generated && npm install');
  console.log('   3. 在代码中导入: import { DexxBigVCallClient } from "./generated/api"');
  console.log('   4. 创建客户端: const client = new DexxBigVCallClient(httpBuilder)');
  console.log('   5. 调用方法: await client.searchTimeline({ ... })');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = main;
