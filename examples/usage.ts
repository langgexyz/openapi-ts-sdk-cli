#!/usr/bin/env ts-node

/**
 * ts-sdk-client-generator 使用示例
 */

import fs from 'fs';
import path from 'path';
import { OpenAPIParser, CodeGenerator, generateFromSpec } from '../src/index';

async function main() {
  console.log('=== ts-sdk-client-generator 使用示例 ===\n');

  // 示例 OpenAPI 规范 (来自 dexx-bigVCall 项目)
  const openApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Dexx BigV Call API',
      description: 'Dexx 大V喊单 API 接口文档',
      version: '1.0.0'
    },
    paths: {
      '/api/bigVCall/searchTimeline': {
        post: {
          operationId: 'searchTimeline',
          summary: '查询代币推文',
          tags: ['Twitter'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    caAddress: {
                      type: 'string',
                      description: '代币地址'
                    }
                  },
                  required: ['caAddress']
                }
              }
            }
          },
          responses: {
            '200': {
              description: '推文查询成功',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      code: { type: 'number' },
                      message: { type: 'string' },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            tweetId: { type: 'string' },
                            text: { type: 'string' },
                            author: { type: 'string' },
                            createdAt: { type: 'string' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/bigVCall/tokenReply': {
        post: {
          operationId: 'queryTokenReply',
          summary: '查询推文回复',
          tags: ['Twitter'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    tweetId: {
                      type: 'string',
                      description: '推文ID'
                    }
                  },
                  required: ['tweetId']
                }
              }
            }
          },
          responses: {
            '200': {
              description: '推文回复查询成功'
            }
          }
        }
      },
      '/api/bigVCall/translate': {
        post: {
          operationId: 'translate',
          summary: '文本翻译',
          tags: ['Translate'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    content: {
                      type: 'string',
                      description: '待翻译的文本内容'
                    }
                  },
                  required: ['content']
                }
              }
            }
          },
          responses: {
            '200': {
              description: '翻译成功'
            }
          }
        }
      }
    }
  };

  console.log('🔍 1. 使用解析器分析 OpenAPI 规范...');
  const parser = new OpenAPIParser();
  const apis = parser.parse(openApiSpec);
  
  console.log(`✅ 解析完成，找到 ${apis.length} 个 API 组:`);
  apis.forEach(api => {
    console.log(`   📁 ${api.className}Api: ${api.operations.length} 个操作`);
    api.operations.forEach(op => {
      console.log(`      🔧 ${op.method} ${op.path} → ${op.name}()`);
    });
  });

  console.log('\n🏗️  2. 生成不同实现的代码...');
  const generator = new CodeGenerator();

  // 生成 Fetch 实现
  console.log('\n📝 生成 Fetch 实现:');
  const fetchCode = generator.generate(apis, {
    implementation: 'fetch',
    packageName: 'ts-sdk-client'
  });
  
  // 保存到文件
  const outputDir = path.join(__dirname, '../generated');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(outputDir, 'fetch-api.ts'), fetchCode);
  console.log('✅ Fetch 实现已保存到 generated/fetch-api.ts');

  // 生成 Axios 实现
  console.log('\n📝 生成 Axios 实现:');
  const axiosCode = generator.generate(apis, {
    implementation: 'axios',
    packageName: 'ts-sdk-client'
  });
  
  fs.writeFileSync(path.join(outputDir, 'axios-api.ts'), axiosCode);
  console.log('✅ Axios 实现已保存到 generated/axios-api.ts');

  // 生成 Gateway 实现
  console.log('\n📝 生成 Gateway 实现:');
  const gatewayCode = generator.generate(apis, {
    implementation: 'gateway',
    packageName: 'ts-sdk-client'
  });
  
  fs.writeFileSync(path.join(outputDir, 'gateway-api.ts'), gatewayCode);
  console.log('✅ Gateway 实现已保存到 generated/gateway-api.ts');

  console.log('\n🚀 3. 使用便捷函数快速生成...');
  const quickCode = await generateFromSpec(openApiSpec, {
    implementation: 'fetch',
    className: 'DexxAPI'
  });
  
  console.log(`✅ 快速生成完成 (${quickCode.length} 字符)`);

  console.log('\n📊 4. 生成的代码统计:');
  console.log(`   Fetch 实现: ${fetchCode.length} 字符`);
  console.log(`   Axios 实现: ${axiosCode.length} 字符`);
  console.log(`   Gateway 实现: ${gatewayCode.length} 字符`);

  console.log('\n🎯 5. 代码预览 (Fetch 实现前 500 字符):');
  console.log('```typescript');
  console.log(fetchCode.substring(0, 500) + '...');
  console.log('```');

  console.log('\n=== 示例完成 ===');
  console.log('🎉 成功生成了基于 ts-sdk-client 的 API 客户端！');
  console.log('\n📁 生成的文件:');
  console.log('   📄 generated/fetch-api.ts');
  console.log('   📄 generated/axios-api.ts'); 
  console.log('   📄 generated/gateway-api.ts');
}

if (require.main === module) {
  main().catch(console.error);
}

export default main;
