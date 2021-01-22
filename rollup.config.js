import path from 'path';
import ts from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

const tsPlugin = ts({
  tsconfig: path.resolve(__dirname, './tsconfig.json'),
  tsconfigOverride: {
    compilerOptions: {
      declaration: true
    },
    include: ['./src']
  }
});

const babelPlugin = babel({ babelHelpers: 'bundled', include: ['./src'] });

export default {
  input: './src/index.ts',
  output: {
    file: './lib/index.js',
    format: 'umd',
    name: 'monitor' // 注入全局对象上的名称
  },
  plugins: [uglify(), babelPlugin, commonjs(), tsPlugin]
};
