import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'index.ts',
  output: {
    file: 'dist/umd/index.js',
    format: 'umd',
    name: 'openapitssdk',
    sourcemap: true,
    globals: {
      'openapi-ts-sdk': 'OpenApiTsSdk',
      'ts-json': 'TsJson',
      'class-transformer': 'ClassTransformer',
      'class-validator': 'ClassValidator',
      'reflect-metadata': 'ReflectMetadata'
    }
  },
  external: ['openapi-ts-sdk', 'ts-json', 'class-transformer', 'class-validator', 'reflect-metadata'],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      declarationMap: false
    }),
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    })
  ]
};