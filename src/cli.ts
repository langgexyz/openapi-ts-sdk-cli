#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
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

const program = new Command();

program
  .name('ts-sdk-generator')
  .description('Generate TypeScript API clients from OpenAPI specifications using ts-sdk-client')
  .version('1.0.0');

program
  .command('generate')
  .description('Generate API client from OpenAPI spec')
  .option('-i, --input <file>', 'OpenAPI specification file (JSON or YAML)')
  .option('-o, --output <dir>', 'Output directory', './generated')
  .option('-n, --name <name>', 'Generated class name prefix')
  .option('-p, --package <package>', 'ts-sdk-client package name', 'ts-sdk-client')
  .action(async (options) => {
    const { input, output, name, package: packageName } = options;
    
    if (!input) {
      console.error('❌ Input file is required. Use -i or --input to specify the OpenAPI file.');
      process.exit(1);
    }

    try {
      console.log('🚀 Starting API generation...');
      console.log(`📄 Input: ${input}`);
      console.log(`📁 Output: ${output}`);
      
      // 读取 OpenAPI 文件
      const specContent = fs.readFileSync(input, 'utf-8');
      let spec: OpenAPISpec;
      
      try {
        spec = JSON.parse(specContent);
      } catch (jsonError) {
        console.error('❌ Failed to parse JSON. YAML support coming soon.');
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

      // 确保输出目录存在
      if (!fs.existsSync(output)) {
        fs.mkdirSync(output, { recursive: true });
        console.log(`📁 Created output directory: ${output}`);
      }

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
          removeComments: false
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
          [packageName]: 'file:../ts-sdk-client'
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
      console.log('   # import { ActivityApi, TwitterApi } from "./index";');
      console.log('   # import { withUri, withHeader, withHeaders } from "./types";');
      console.log('   # ');
      console.log('   # const twitterApi = new TwitterApi(httpBuilder);');
      console.log('   # const result = await twitterApi.record(');
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
  .option('-i, --input <file>', 'OpenAPI specification file')
  .action((options) => {
    const { input } = options;
    
    if (!input) {
      console.error('❌ Input file is required');
      process.exit(1);
    }

    try {
      const specContent = fs.readFileSync(input, 'utf-8');
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