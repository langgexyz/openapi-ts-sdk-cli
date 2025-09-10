# TypeScript SDK Client Generator

[![npm version](https://badge.fury.io/js/ts-sdk-client-generator.svg)](https://badge.fury.io/js/ts-sdk-client-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

一个强大的 TypeScript 代码生成器，能够从 OpenAPI 规范自动生成类型安全的 API 客户端代码。生成的客户端基于 [ts-sdk-client](../ts-sdk-client) 架构，支持多种 HTTP 实现和 Go 风格的函数式选项模式。

## ✨ 特性

- 🎯 **类型安全**：完整的 TypeScript 类型定义，编译时错误检查
- 🏗️ **模块化设计**：按 Controller 分离，支持按需导入
- 🔧 **函数式选项**：Go 风格的选项模式，灵活组合请求参数
- 🌐 **多 HTTP 实现**：支持 Fetch、Axios、Gateway SDK 等多种实现
- 📦 **零依赖**：生成的代码无额外依赖，轻量级
- 🔄 **向后兼容**：提供统一客户端类，平滑迁移
- 🎨 **自定义支持**：动态 URI、自定义 Headers、超时控制
- 📚 **完整文档**：自动生成 JSDoc 注释和使用示例

## 🚀 快速开始

### 安装

```bash
# 全局安装
npm install -g ts-sdk-client-generator

# 或本地安装
npm install ts-sdk-client-generator --save-dev
```

### 基本使用

```bash
# 1. 生成 API 客户端
ts-sdk-generator generate -i ./openapi.json -o ./generated

# 2. 安装生成的依赖
cd ./generated
npm install

# 3. 在你的项目中使用
```

### 开发环境使用

```bash
# 克隆项目
git clone <repository-url>
cd ts-sdk-client-generator

# 安装依赖
npm install

# 构建项目
npm run build

# 生成 API 客户端
./dist/cli.js generate -i ../openapi.json -o ./generated
```

## 📖 使用生成的 API 客户端

生成的代码按 Controller 分离，每个 Controller 对应一个独立的 API 类，支持多种使用方式：

### 🔧 按需导入单个 Controller

```typescript
import { FetchHttpBuilder } from 'ts-sdk-client';
import { TwitterApi, ActivityApi } from './generated/index';

// 创建 HTTP Builder
const httpBuilder = new FetchHttpBuilder('https://api.example.com');

// 创建特定的 API 客户端
const twitterApi = new TwitterApi(httpBuilder);
const activityApi = new ActivityApi(httpBuilder);

// 调用 API 方法（支持 options 参数）
async function example() {
  try {
    // 基本调用
    const timeline = await twitterApi.searchTimeline({ 
      caAddress: '0x1234567890abcdef' 
    });
    
    // 使用函数式选项
    const activity = await activityApi.top(
      {},
      withUri('/api/custom/activity'),
      withAuth('bearer-token'),
      withHeader('X-Custom-Header', 'value')
    );
    
    console.log({ timeline, activity });
  } catch (error) {
    console.error('API 调用失败:', error);
  }
}
```

### 🏢 使用统一客户端（向后兼容）

```typescript
import { FetchHttpBuilder } from 'ts-sdk-client';
import { UnifiedApiClient } from './generated/index';

const httpBuilder = new FetchHttpBuilder('https://api.example.com');
const client = new UnifiedApiClient(httpBuilder);

// 通过属性访问各个 Controller
const result1 = await client.twitter.searchTimeline({ caAddress: '0x...' });
const result2 = await client.activity.top({}, withUri('/custom/uri'));
```

## 🎛️ Go 风格函数式选项模式

生成的客户端支持 Go 风格的函数式选项模式，让 API 调用更加灵活和可组合：

### 选项构造函数

```typescript
// 从生成的 types.ts 导入选项构造函数
import { 
  withUri, withHeaders, withHeader, withAuth, 
  withTimeout, withContentType, combineOptions 
} from './generated/types';
```

### 使用示例

```typescript
import { TwitterApi } from './generated';
import { withUri, withAuth, withHeader, withTimeout, combineOptions } from './generated/types';

const api = new TwitterApi(httpBuilder);

// 1. 基本调用
await api.searchTimeline({ caAddress: '0x...' });

// 2. 使用单个选项
await api.searchTimeline(
  { caAddress: '0x...' },
  withUri('/api/v2/twitter/search')
);

// 3. 使用多个选项
await api.searchTimeline(
  { caAddress: '0x...' },
  withUri('/api/custom/twitter'),
  withAuth('your-jwt-token'),
  withTimeout(5000)
);

// 4. 灵活的选项组合
await api.searchTimeline(
  { caAddress: '0x...' },
  withHeader('X-Request-ID', 'unique-123'),
  withHeader('X-Client-Version', '1.0.0'),
  withContentType('application/json; charset=utf-8')
);

// 5. 预定义选项组合
const authOptions = combineOptions(
  withAuth('token'),
  withHeader('X-Client', 'web-app')
);

await api.searchTimeline(
  { caAddress: '0x...' },
  authOptions,
  withTimeout(10000)
);
```

### 可用的选项构造函数

| 函数 | 说明 | 示例 |
|------|------|------|
| `withUri(uri)` | 自定义请求 URI | `withUri('/api/v2/search')` |
| `withHeaders(headers)` | 批量设置 headers | `withHeaders({ 'X-API': 'v1' })` |
| `withHeader(key, value)` | 设置单个 header | `withHeader('Authorization', 'Bearer token')` |
| `withAuth(token)` | 设置认证 token | `withAuth('jwt-token')` |
| `withTimeout(ms)` | 设置超时时间 | `withTimeout(5000)` |
| `withContentType(type)` | 设置 Content-Type | `withContentType('application/xml')` |
| `combineOptions(...opts)` | 组合多个选项 | `combineOptions(withAuth('token'), withTimeout(5000))` |

## 🌐 支持的 HTTP 实现

生成的客户端使用抽象的 `HttpBuilder` 接口，业务层可以选择任何具体实现，满足不同场景需求：

### 1. 使用 Fetch 实现
```typescript
import { FetchHttpBuilder } from 'ts-sdk-client';
import { TwitterApi } from './generated';

const httpBuilder = new FetchHttpBuilder('https://api.example.com');
const twitterApi = new TwitterApi(httpBuilder);
```

### 2. 使用 Axios 实现
```typescript
import axios from 'axios';
import { AxiosHttpBuilder } from 'ts-sdk-client';
import { TwitterApi } from './generated';

const axiosInstance = axios.create({ timeout: 10000 });
const httpBuilder = new AxiosHttpBuilder('https://api.example.com', axiosInstance);
const twitterApi = new TwitterApi(httpBuilder);
```

### 3. 使用 Gateway SDK 实现
```typescript
import { createClient, HeaderBuilder } from 'gateway-ts-sdk';
import { GatewayHttpBuilder } from 'ts-sdk-client';
import { TwitterApi } from './generated';

const gatewayClient = createClient('ws://localhost:18443', 'my-client');
const httpBuilder = new GatewayHttpBuilder('https://api.example.com', gatewayClient, HeaderBuilder);
const twitterApi = new TwitterApi(httpBuilder);
```

## 🛠️ CLI 选项

| 选项 | 描述 | 默认值 | 示例 |
|------|------|--------|------|
| `-i, --input <file>` | OpenAPI 规范文件 (JSON/YAML) | 必需 | `-i ./api.json` |
| `-o, --output <dir>` | 输出目录 | `./generated` | `-o ./src/api` |
| `-n, --name <name>` | 生成的类名前缀 | 从项目名称推断 | `-n MyAPI` |
| `-p, --package <package>` | ts-sdk-client 包名 | `ts-sdk-client` | `-p @my/ts-sdk` |
| `-t, --template <template>` | 代码模板类型 | `default` | `-t minimal` |
| `--help` | 显示帮助信息 | - | `--help` |
| `--version` | 显示版本信息 | - | `--version` |

### 使用示例

```bash
# 基本用法
ts-sdk-generator generate -i ./openapi.json -o ./generated

# 自定义配置
ts-sdk-generator generate \
  -i ./api-spec.yaml \
  -o ./src/api \
  -n MyCompanyAPI \
  -p @mycompany/api-client

# 查看帮助
ts-sdk-generator --help
```

## 💻 编程 API

除了 CLI 工具，你也可以在 Node.js 代码中直接使用生成器：

```typescript
import { OpenAPIParser, CodeGenerator, generateFromSpec } from 'ts-sdk-client-generator';

// 方式 1: 使用便捷函数
const code = await generateFromSpec(openApiSpec, {
  className: 'MyAPI',
  packageName: 'ts-sdk-client'
});

// 方式 2: 分步使用
const parser = new OpenAPIParser();
const apis = parser.parse(openApiSpec);

const generator = new CodeGenerator();
const files = generator.generate(apis, {
  className: 'MyAPI',
  packageName: 'ts-sdk-client'
});

// files 是一个 Map<string, string>，键是文件名，值是文件内容
for (const [filename, content] of files) {
  console.log(`生成文件: ${filename}`);
  // 保存到文件系统
  fs.writeFileSync(filename, content);
}
```

### API 参考

#### `generateFromSpec(spec, options)`
- `spec`: OpenAPI 规范对象
- `options`: 生成选项
  - `className`: 生成的类名前缀
  - `packageName`: ts-sdk-client 包名
  - `implementation`: HTTP 实现类型 ('fetch' | 'axios' | 'gateway')

#### `OpenAPIParser`
- `parse(spec)`: 解析 OpenAPI 规范，返回 `ParsedAPI[]`

#### `CodeGenerator`
- `generate(apis, options)`: 生成代码，返回 `Map<string, string>`

## 🧪 测试

项目包含完整的测试套件，确保代码质量和功能正确性：

```bash
# 运行所有测试
npm test

# 运行单元测试
npm run test:unit

# 运行集成测试
npm run test:integration

# 运行功能测试
npm run test:functional

# 运行 OpenAPI 版本兼容性测试
npm run test:openapi-versions

# 生成测试覆盖率报告
npm run test:coverage
```

## 📁 项目结构

```
ts-sdk-client-generator/
├── src/                          # 源代码
│   ├── cli.ts                   # CLI 入口
│   ├── index.ts                 # 主入口文件
│   └── generator/               # 代码生成器
│       ├── openapi-parser.ts    # OpenAPI 解析器
│       └── code-generator.ts    # 代码生成器
├── tests/                       # 测试文件
│   ├── integration.test.ts      # 集成测试
│   ├── code-generator.test.ts   # 代码生成器测试
│   ├── openapi-parser.test.ts   # 解析器测试
│   └── openapi-versions.test.ts # 版本兼容性测试
├── examples/                    # 使用示例
│   ├── simple-usage.js         # 简单使用示例
│   └── usage.ts                # TypeScript 使用示例
├── dist/                        # 编译输出
├── package.json                 # 项目配置
├── tsconfig.json               # TypeScript 配置
├── jest.config.js              # Jest 测试配置
└── README.md                   # 项目文档
```

## 🤝 贡献

我们欢迎社区贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

### 开发指南

```bash
# 克隆项目
git clone <repository-url>
cd ts-sdk-client-generator

# 安装依赖
npm install

# 开发模式（监听文件变化）
npm run watch

# 运行测试
npm test

# 构建项目
npm run build
```

## 📋 支持的 OpenAPI 版本

- ✅ OpenAPI 3.0.x
- ✅ OpenAPI 3.1.x
- ✅ Swagger 2.0 (OpenAPI 2.0)

## 🔗 相关项目

- [ts-sdk-client](../ts-sdk-client) - TypeScript SDK 客户端库
- [OpenAPI Generator](https://openapi-generator.tech/) - 其他语言的代码生成器
- [Swagger Codegen](https://swagger.io/tools/swagger-codegen/) - Swagger 官方代码生成器

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和社区成员！

---

**Made with ❤️ by the TypeScript SDK Team**