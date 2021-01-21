import path from 'path';
import ts from 'rollup-plugin-typescript2';

const tsPlugin = ts({
  tsconfig: path.resolve(__dirname, './tsconfig.json'),
  tsconfigOverride: {
    compilerOptions: {
      declaration: true
    }
  }
});

export default {
  input: './src/index.ts',
  output: {
    file: './lib/index.js',
    format: 'umd',
    name: 'monitor' // 注入全局对象上的名称
  },
  plugins: [tsPlugin]
};
