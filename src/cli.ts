#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { Command } from 'commander';
import { OpenAPIParser, OpenAPISpec } from './generator/openapi-parser';
import { CodeGenerator } from './generator/code-generator';

interface PackageJsonStructure {
  name: string;
  version: string;
  description: string;
  main: string;
  types: string;
  scripts?: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies?: Record<string, string>;
}

/**
 * 检测输入是否为 URL
 */
function isUrl(input: string): boolean {
  return input.startsWith('http://') || input.startsWith('https://');
}

/**
 * 从 URL 获取内容
 */
function fetchFromUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https://') ? https : http;
    
    const request = client.get(url, (response) => {
      if (response.statusCode && (response.statusCode < 200 || response.statusCode >= 300)) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }

      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data);
      });
    });

    request.on('error', (error) => {
      reject(new Error(`网络请求失败: ${error.message}`));
    });

    // 设置超时
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('请求超时 (30s)'));
    });
  });
}

const program = new Command();

program
  .name('ts-sdk-generator')
  .description('Generate TypeScript API clients from OpenAPI specifications using ts-sdk-client')
  .version('1.0.0');

program
  .command('generate')
  .description('Generate API client from OpenAPI spec')
  .option('-i, --input <file>', 'OpenAPI specification file (JSON) or URL (http://|https://)')
  .option('-o, --output <dir>', 'Output directory', './generated')
  .option('-n, --name <name>', 'Generated class name prefix')
  .option('-p, --package <package>', 'ts-sdk-client package name', 'ts-sdk-client')
  .action(async (options) => {
    const { input, output, name, package: packageName } = options;
    
    if (!input) {
      console.error('❌ Input file or URL is required. Use -i or --input to specify the OpenAPI file or URL.');
      console.error('   示例:');
      console.error('   -i ./openapi.json                    # 本地文件');
      console.error('   -i https://api.example.com/openapi   # 网络地址');
      process.exit(1);
    }

    try {
      console.log('🚀 Starting API generation...');
      console.log(`📄 Input: ${input}`);
      console.log(`📁 Output: ${output}`);
      
      // 读取 OpenAPI 文件（支持本地文件和 URL）
      let specContent: string;
      
      if (isUrl(input)) {
        console.log('🌐 从网络地址获取 OpenAPI 规范...');
        try {
          specContent = await fetchFromUrl(input);
          console.log('✅ 网络获取成功');
        } catch (fetchError) {
          const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError);
          console.error(`❌ 网络获取失败: ${errorMessage}`);
          process.exit(1);
        }
      } else {
        console.log('📂 从本地文件读取 OpenAPI 规范...');
        try {
          specContent = fs.readFileSync(input, 'utf-8');
          console.log('✅ 本地文件读取成功');
        } catch (fileError) {
          const errorMessage = fileError instanceof Error ? fileError.message : String(fileError);
          console.error(`❌ 本地文件读取失败: ${errorMessage}`);
          process.exit(1);
        }
      }
      
      let spec: OpenAPISpec;
      
      try {
        spec = JSON.parse(specContent);
      } catch (jsonError) {
        console.error('❌ JSON 解析失败。当前仅支持 JSON 格式，YAML 支持即将推出。');
        if (process.env.DEBUG) {
          console.error('解析错误详情:', jsonError);
        }
        process.exit(1);
      }

      // 解析 OpenAPI
      console.log('🔍 Parsing OpenAPI specification...');
      const parser = new OpenAPIParser();
      const apis = parser.parse(spec);
      console.log(`✅ Found ${apis.length} API group(s)`);

      // 尝试读取项目 package.json 获取项目名称
      let projectName = '';
      try {
        // 首先尝试从输入文件路径推断项目根目录
        const inputDir = path.dirname(path.resolve(input));
        const packageJsonPath = path.join(inputDir, 'package.json');
        
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
          projectName = packageJson.name || '';
          console.log(`📦 从项目 package.json 读取到项目名称: ${projectName}`);
        } else {
          // 如果输入文件所在目录没有 package.json，尝试当前目录
          const currentPackageJsonPath = path.resolve(process.cwd(), 'package.json');
          if (fs.existsSync(currentPackageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(currentPackageJsonPath, 'utf-8'));
            projectName = packageJson.name || '';
          }
        }
      } catch (error) {
        // 忽略读取错误，使用默认值
        console.log('⚠️  无法读取项目 package.json，将使用默认类名');
      }

      // 生成代码
      console.log('🏗️  Generating TypeScript code...');
      const generator = new CodeGenerator();
      const files = generator.generate(apis, {
        className: name,
        packageName,
        projectName
      });

      // 清理并重新创建输出目录
      if (fs.existsSync(output)) {
        fs.rmSync(output, { recursive: true, force: true });
        console.log(`🧹 Cleaned existing directory: ${output}`);
      }
      fs.mkdirSync(output, { recursive: true });
      console.log(`📁 Created output directory: ${output}`);

      // 写入生成的文件
      const writtenFiles: string[] = [];
      for (const [fileName, content] of files) {
        const filePath = path.join(output, fileName);
        fs.writeFileSync(filePath, content);
        writtenFiles.push(fileName);
      }

      // 生成 tsconfig.json
      const tsconfigPath = path.join(output, 'tsconfig.json');
      const tsconfig = {
        compilerOptions: {
          target: 'ES2020',
          lib: ['ES2020'],
          module: 'CommonJS',
          declaration: true,
          outDir: './dist',
          rootDir: './',
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
          moduleResolution: 'node',
          resolveJsonModule: true,
          allowSyntheticDefaultImports: true,
          sourceMap: false,
          removeComments: false,
          experimentalDecorators: true,
          emitDecoratorMetadata: true
        },
        include: ['*.ts'],
        exclude: ['node_modules', 'dist']
      };
      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
      writtenFiles.push('tsconfig.json');

      // 生成 package.json（如果不存在）
      const packageJsonPath = path.join(output, 'package.json');
      if (!fs.existsSync(packageJsonPath)) {
      const packageJson: PackageJsonStructure = {
        name: 'generated-api-client',
        version: '1.0.0',
        description: 'Generated API client from OpenAPI specification',
        main: 'dist/index.js',
        types: 'dist/index.d.ts',
        scripts: {
          build: 'tsc',
          clean: 'rm -rf dist',
          prepublishOnly: 'npm run clean && npm run build'
        },
        dependencies: {
          [packageName]: 'file:../../ts-sdk-client',
          'class-transformer': '^0.5.1',
          'class-validator': '^0.14.0',
          'reflect-metadata': '^0.1.13'
        },
        devDependencies: {
          typescript: '^5.0.0'
        }
      };
        
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log(`📦 Generated package.json`);
      }

      console.log('✅ API client generated successfully!');
      console.log(`📝 Generated files:`);
      writtenFiles.forEach(file => console.log(`   📄 ${file}`));
      console.log(`📊 Total controllers: ${writtenFiles.filter(f => f.endsWith('.api.ts')).length}`);
      console.log('');
      console.log('🎯 Next steps:');
      console.log(`   cd ${output}`);
      console.log('   npm install');
      console.log('   # 使用示例:');
      console.log('   # import { DataApi, UserApi } from "./index";');
      console.log('   # import { withUri, withHeader, withHeaders } from "./types";');
      console.log('   # ');
      console.log('   # const userApi = new UserApi(httpBuilder);');
      console.log('   # const result = await userApi.record(');
      console.log('   #   { data: {...} },');
      console.log('   #   withUri("/custom/path"),');
      console.log('   #   withHeader("X-Request-ID", "unique-id"),');
      console.log('   #   withHeaders({ "X-Custom": "value" })');
      console.log('   # );');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      console.error('❌ Generation failed:', errorMessage);
      if (process.env.DEBUG && errorStack) {
        console.error(errorStack);
      }
      process.exit(1);
    }
  });

program
  .command('validate')
  .description('Validate OpenAPI specification')
  .option('-i, --input <file>', 'OpenAPI specification file or URL')
  .action(async (options) => {
    const { input } = options;
    
    if (!input) {
      console.error('❌ Input file or URL is required');
      process.exit(1);
    }

    try {
      console.log(`🔍 Validating OpenAPI specification: ${input}`);
      
      // 读取 OpenAPI 文件（支持本地文件和 URL）
      let specContent: string;
      
      if (isUrl(input)) {
        console.log('🌐 从网络地址获取 OpenAPI 规范...');
        try {
          specContent = await fetchFromUrl(input);
          console.log('✅ 网络获取成功');
        } catch (fetchError) {
          const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError);
          console.error(`❌ 网络获取失败: ${errorMessage}`);
          process.exit(1);
        }
      } else {
        console.log('📂 从本地文件读取 OpenAPI 规范...');
        try {
          specContent = fs.readFileSync(input, 'utf-8');
          console.log('✅ 本地文件读取成功');
        } catch (fileError) {
          const errorMessage = fileError instanceof Error ? fileError.message : String(fileError);
          console.error(`❌ 本地文件读取失败: ${errorMessage}`);
          process.exit(1);
        }
      }
      
      const spec = JSON.parse(specContent);
      
      // 基本验证
      if (!spec.openapi && !spec.swagger) {
        throw new Error('Not a valid OpenAPI specification');
      }
      
      if (!spec.paths) {
        throw new Error('No paths defined in the specification');
      }
      
      console.log('✅ OpenAPI specification is valid');
      console.log(`📋 Version: ${spec.openapi || spec.swagger}`);
      console.log(`📄 Title: ${spec.info?.title || 'Untitled'}`);
      console.log(`🔗 Paths: ${Object.keys(spec.paths).length}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ Validation failed:', errorMessage);
      process.exit(1);
    }
  });

program.parse();