import commonjs from '@rollup/plugin-commonjs';
import sucrase from '@rollup/plugin-sucrase';
import styles from 'rollup-plugin-styles';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import path from 'path';

import typescriptPaths from '../../scripts/rollup-plugin-typescript-paths';

export default [
  {
    input: 'src/index.tsx',
    output: {
      file: 'dist/index.js',
      format: 'system',
    },

    external: ['react', 'react-dom', /@one-for-all\/.*/],

    plugins: [
      commonjs(),
      nodeResolve({
        browser: true,
        mainFields: ['main'],
      }),
      typescriptPaths(),
      sucrase({
        exclude: ['node_modules/**'],
        transforms: ['typescript', 'jsx'],
        production: true,
      }),
      styles(),
      copy({
        targets: [
          { src: path.resolve(__dirname, '../ui/dist/images/**/*'), dest: 'dist/images' },
          { src: path.resolve(__dirname, '../ui/assets/images/**/*'), dest: 'dist/images' },
        ],
        copyOnce: true,
      }),
    ],
  },
];
