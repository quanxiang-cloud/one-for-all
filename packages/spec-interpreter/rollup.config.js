import sucrase from '@rollup/plugin-sucrase';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import typescriptPaths from '../../rollup-plugin-typescript-paths';

export default {
  input: 'index.ts',
  output: {
    file: 'dist/index.js',
    format: 'system'
  },

  external: ['lodash'],

  plugins: [
    commonjs(),
    nodeResolve(),
    typescriptPaths(),
    sucrase({
      // exclude: ['node_modules/**'],
      // transforms: ['typescript', 'jsx'],
      transforms: ['typescript'],
      production: true
    }),
  ]
};
