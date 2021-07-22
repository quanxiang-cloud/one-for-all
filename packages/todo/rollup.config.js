import sucrase from '@rollup/plugin-sucrase';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import typescriptPaths from '../../rollup-plugin-typescript-paths';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/todo.js',
      format: 'system'
    },

    external: ['react', 'react-dom'],

    plugins: [
      nodeResolve({
        browser: true,
        mainFields: ['main'],
      }),
      typescriptPaths(),
      sucrase({
        exclude: ['node_modules/**'],
        transforms: ['typescript', 'jsx'],
        production: true
      }),
    ]
  },
  {
    input: 'index.ts',
    output: {
      file: 'dist/index.js',
      format: 'system'
    },
    plugins: [
      nodeResolve({
        browser: true,
        mainFields: ['main'],
      }),
      typescriptPaths(),
      sucrase({
        exclude: ['node_modules/**'],
        transforms: ['typescript', 'jsx'],
        production: true
      }),
    ]
  }
];
