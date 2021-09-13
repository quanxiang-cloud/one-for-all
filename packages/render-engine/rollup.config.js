import sucrase from '@rollup/plugin-sucrase';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import typescriptPaths from '../../rollup-plugin-typescript-paths';

export default {
  input: 'index.ts',
  output: {
    file: 'dist/index.js',
    format: 'system'
  },

  external: ['react', 'react-dom', 'lodash'],

  plugins: [
    nodeResolve(),
    typescriptPaths(),
    sucrase({
      exclude: ['node_modules/**'],
      transforms: ['typescript', 'jsx'],
      production: true
    }),
  ]
};
