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
  module?: string;
  types: string;
  browser?: string;
  unpkg?: string;
  jsdelivr?: string;
  files?: string[];
  keywords?: string[];
  repository?: {
    type: string;
    url: string;
  };
  author?: string;
  license?: string;
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
  .name('openapi-ts-sdk-cli')
  .description('A powerful CLI tool to generate TypeScript SDK clients from OpenAPI specifications')
  .version('1.0.0');

program
  .command('generate')
  .description('Generate API client from OpenAPI spec')
  .option('-i, --input <file>', 'OpenAPI specification file (JSON) or URL (http://|https://)', 'http://localhost:7001/swagger-ui/index.json')
  .option('-o, --output <dir>', 'Output directory', './generated')
  .option('-n, --name <name>', 'Generated class name prefix')
  .option('-p, --package <package>', 'openapi-ts-sdk package name', 'openapi-ts-sdk')
  .option('-v, --version <version>', 'Package version (default: 1.0.0)', '1.0.0')
  .action(async (options) => {
    const { input, output, name, package: packageName } = options;
    
    if (!input) {
      console.error('Input file or URL is required. Use -i or --input to specify the OpenAPI file or URL.');
      console.error('   Examples:');
      console.error('   -i ./openapi.json                    # Local file');
      console.error('   -i http://localhost:7001/swagger-ui/index.json   # Network URL');
      process.exit(1);
    }

    try {
      console.log('Starting API generation...');
      console.log(`Input: ${input}`);
      console.log(`Output: ${output}`);
      console.log(`Version: ${options.version}`);
      
      // 读取 OpenAPI 文件（支持本地文件和 URL）
      let specContent: string;
      
      if (isUrl(input)) {
        console.log('Fetching OpenAPI specification from URL...');
        try {
          specContent = await fetchFromUrl(input);
          console.log('Successfully fetched from URL');
        } catch (fetchError) {
          const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError);
          console.error(`Failed to fetch from URL: ${errorMessage}`);
          process.exit(1);
        }
      } else {
        console.log('Reading OpenAPI specification from local file...');
        try {
          specContent = fs.readFileSync(input, 'utf-8');
          console.log('Successfully read local file');
        } catch (fileError) {
          const errorMessage = fileError instanceof Error ? fileError.message : String(fileError);
          console.error(`Failed to read local file: ${errorMessage}`);
          process.exit(1);
        }
      }
      
      let spec: OpenAPISpec;
      
      try {
        spec = JSON.parse(specContent);
      } catch (jsonError) {
        console.error('JSON parsing failed. Currently only JSON format is supported, YAML support coming soon.');
        if (process.env.DEBUG) {
          console.error('Parse error details:', jsonError);
        }
        process.exit(1);
      }

      // 解析 OpenAPI
      console.log('Parsing OpenAPI specification...');
      const parser = new OpenAPIParser();
      const apis = parser.parse(spec);
      console.log(`Found ${apis.length} API group(s)`);

      // 尝试读取项目 package.json 获取项目名称
      let projectName = '';
      try {
        // 首先尝试从输入文件路径推断项目根目录
        const inputDir = path.dirname(path.resolve(input));
        const packageJsonPath = path.join(inputDir, 'package.json');
        
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
          projectName = packageJson.name || '';
          console.log(`Read project name from package.json: ${projectName}`);
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
        console.log('Unable to read project package.json, using default class name');
      }

      // 生成代码
      console.log('Generating TypeScript code...');
      const generator = new CodeGenerator();
      const files = generator.generate(apis, {
        className: name,
        packageName,
        projectName,
        sourceContent: specContent // 传递源文件内容用于生成hash
      });

      // 清理并重新创建输出目录
      if (fs.existsSync(output)) {
        fs.rmSync(output, { recursive: true, force: true });
        console.log(`Cleaned existing directory: ${output}`);
      }
      fs.mkdirSync(output, { recursive: true });
      console.log(`Created output directory: ${output}`);
      
      // 创建 src 目录
      const srcDir = path.join(output, 'src');
      fs.mkdirSync(srcDir, { recursive: true });
      console.log(`Created src directory: ${srcDir}`);

      // 写入生成的文件
      const writtenFiles: string[] = [];
      for (const [fileName, content] of files) {
        // index.ts 放在根目录，其他 TypeScript 文件放在 src 目录中
        const isIndexFile = fileName === 'index.ts';
        const isTypeScriptFile = fileName.endsWith('.ts');
        const targetDir = isIndexFile ? output : (isTypeScriptFile ? srcDir : output);
        const filePath = path.join(targetDir, fileName);
        
        fs.writeFileSync(filePath, content);
        writtenFiles.push(isIndexFile ? fileName : (isTypeScriptFile ? `src/${fileName}` : fileName));
      }

      // 生成 tsconfig.cjs.json (CommonJS)
      const tsconfigCjsPath = path.join(output, 'tsconfig.cjs.json');
      const tsconfigCjs = {
        extends: './tsconfig.json',
        compilerOptions: {
          module: 'CommonJS',
          outDir: './dist/cjs',
          declaration: false,
          declarationMap: false
        },
        include: ['src/**/*.ts', 'index.ts']
      };
      fs.writeFileSync(tsconfigCjsPath, JSON.stringify(tsconfigCjs, null, 2));
      writtenFiles.push('tsconfig.cjs.json');

      // 生成 tsconfig.json (ES Modules)
      const tsconfigPath = path.join(output, 'tsconfig.json');
      const tsconfig = {
        compilerOptions: {
          target: 'ES2020',
          lib: ['ES2020'],
          module: 'ES2020',
          declaration: false,
          declarationMap: false,
          outDir: './dist/esm',
          rootDir: '.',
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
        include: ['src/**/*.ts', 'index.ts'],
        exclude: ['node_modules', 'dist']
      };
      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
      writtenFiles.push('tsconfig.json');

      // 生成 tsconfig.umd.json (UMD)
      const tsconfigUmdPath = path.join(output, 'tsconfig.umd.json');
      const tsconfigUmd = {
        extends: './tsconfig.json',
        compilerOptions: {
          module: 'UMD',
          outDir: 'dist/umd',
          resolveJsonModule: false,
          declaration: false,
          declarationMap: false
        },
        include: ['src/**/*.ts', 'index.ts']
      };
      fs.writeFileSync(tsconfigUmdPath, JSON.stringify(tsconfigUmd, null, 2));
      writtenFiles.push('tsconfig.umd.json');

      // 生成 tsconfig.types.json (类型定义文件)
      const tsconfigTypesPath = path.join(output, 'tsconfig.types.json');
      const tsconfigTypes = {
        extends: './tsconfig.json',
        compilerOptions: {
          module: 'ES6',
          outDir: 'dist/types',
          declaration: true,
          declarationMap: true,
          emitDeclarationOnly: true,
          noEmit: false
        },
        include: ['src/**/*.ts', 'index.ts']
      };
      fs.writeFileSync(tsconfigTypesPath, JSON.stringify(tsconfigTypes, null, 2));
      writtenFiles.push('tsconfig.types.json');

      // 不再生成 rollup.config.js，使用 TypeScript 编译器

      // 生成 package.json
      const packageJsonPath = path.join(output, 'package.json');
      // 根据输出目录名生成package name
      const outputDirName = path.basename(path.resolve(output));
      const generatedPackageName = outputDirName.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
      
      const packageJson: PackageJsonStructure = {
        name: generatedPackageName,
        version: options.version || '1.0.0',
        description: 'Generated API client from OpenAPI specification',
        main: 'dist/cjs/index.js',
        module: 'dist/esm/index.js',
        types: 'dist/types/index.d.ts',
        browser: 'dist/umd/index.js',
        unpkg: 'dist/umd/index.js',
        jsdelivr: 'dist/umd/index.js',
        files: ['dist/**/*', 'README.md'],
        keywords: ['api', 'client', 'typescript', 'openapi', 'generated'],
        repository: {
          type: 'git',
          url: 'git+https://github.com/your-org/your-repo.git'
        },
        author: 'Generated by openapi-ts-sdk-cli',
        license: 'MIT',
        scripts: {
          build: 'npm run build:cjs && npm run build:esm && npm run build:umd && npm run build:types',
          'build:cjs': 'tsc -p tsconfig.cjs.json',
          'build:esm': 'tsc -p tsconfig.json',
          'build:umd': 'tsc -p tsconfig.umd.json',
          'build:types': 'tsc -p tsconfig.types.json',
          test: 'echo "No tests specified" && exit 0'
        },
        dependencies: {
          'openapi-ts-sdk': 'https://github.com/langgexyz/openapi-ts-sdk.git#semver:^1.0.0',
          'class-transformer': '^0.5.1',
          'class-validator': '^0.14.0',
          'reflect-metadata': '^0.1.13'
        },
        devDependencies: {
          'typescript': '^5.0.0'
        },
      };
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log(`Generated package.json`);

      // 编译TypeScript到JavaScript
      console.log('Compiling TypeScript to JavaScript...');
      try {
        const { execSync } = require('child_process');
        
        // 先安装TypeScript
        console.log('Installing TypeScript...');
        execSync('npm install typescript --no-save', { 
          cwd: output, 
          stdio: 'inherit' 
        });
        
        // 编译CJS版本
        execSync('npx tsc -p tsconfig.cjs.json', { 
          cwd: output, 
          stdio: 'inherit' 
        });
        console.log('CJS compilation completed');
        
        // 编译ESM版本
        execSync('npx tsc -p tsconfig.json', { 
          cwd: output, 
          stdio: 'inherit' 
        });
        console.log('ESM compilation completed');
        
        // 编译UMD版本
        execSync('npx tsc -p tsconfig.umd.json', { 
          cwd: output, 
          stdio: 'inherit' 
        });
        console.log('UMD compilation completed');
        
        // 编译类型定义
        execSync('npx tsc -p tsconfig.types.json', { 
          cwd: output, 
          stdio: 'inherit' 
        });
        console.log('Type definitions compilation completed');
        
        // 清理临时安装的TypeScript
        execSync('rm -rf node_modules package-lock.json', { 
          cwd: output, 
          stdio: 'inherit' 
        });
        console.log('Cleaned up temporary files');
        
      } catch (error) {
        console.error('Compilation failed:', error instanceof Error ? error.message : String(error));
        console.log('Generated TypeScript files are available, but JavaScript compilation failed');
        console.log('You may need to install TypeScript: npm install typescript');
      }

      console.log('API client generated successfully!');
      console.log(`Generated files:`);
      writtenFiles.forEach(file => console.log(`   - ${file}`));
      console.log(`Total controllers: ${writtenFiles.filter(f => f.endsWith('.api.ts')).length}`);
      console.log('');
      console.log('Next steps:');
      console.log(`   cd ${output}`);
      console.log('   npm install');
      console.log('   # Usage example:');
      console.log('   # import { User } from "./index";');
      console.log('   # ');
      console.log('   # // 1. Using Axios HttpBuilder');
      console.log('   # import { AxiosHttpBuilder } from "openapi-ts-sdk-axios";');
      console.log('   # const axiosBuilder = new AxiosHttpBuilder("http://localhost:3000");');
      console.log('   # const userApi = new User.Client(axiosBuilder);');
      console.log('   # ');
      console.log('   # // 2. Using Fetch HttpBuilder');
      console.log('   # import { FetchHttpBuilder } from "openapi-ts-sdk-fetch";');
      console.log('   # const fetchBuilder = new FetchHttpBuilder("http://localhost:3000");');
      console.log('   # const userApi2 = new User.Client(fetchBuilder);');
      console.log('   # ');
      console.log('   # // 3. Using Gateway HttpBuilder');
      console.log('   # import { GatewayHttpBuilder } from "openapi-ts-sdk-gateway";');
      console.log('   # const gatewayBuilder = new GatewayHttpBuilder("http://localhost:3000");');
      console.log('   # const userApi3 = new User.Client(gatewayBuilder);');
      console.log('   # ');
      console.log('   # const result = await userApi.getUsers();');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      console.error('Generation failed:', errorMessage);
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
      console.error('Input file or URL is required');
      process.exit(1);
    }

    try {
      console.log(`Validating OpenAPI specification: ${input}`);
      
      // 读取 OpenAPI 文件（支持本地文件和 URL）
      let specContent: string;
      
      if (isUrl(input)) {
        console.log('Fetching OpenAPI specification from URL...');
        try {
          specContent = await fetchFromUrl(input);
          console.log('Successfully fetched from URL');
        } catch (fetchError) {
          const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError);
          console.error(`Failed to fetch from URL: ${errorMessage}`);
          process.exit(1);
        }
      } else {
        console.log('Reading OpenAPI specification from local file...');
        try {
          specContent = fs.readFileSync(input, 'utf-8');
          console.log('Successfully read local file');
        } catch (fileError) {
          const errorMessage = fileError instanceof Error ? fileError.message : String(fileError);
          console.error(`Failed to read local file: ${errorMessage}`);
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
      
      console.log('OpenAPI specification is valid');
      console.log(`Version: ${spec.openapi || spec.swagger}`);
      console.log(`Title: ${spec.info?.title || 'Untitled'}`);
      console.log(`Paths: ${Object.keys(spec.paths).length}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Validation failed:', errorMessage);
      process.exit(1);
    }
  });

program.parse();