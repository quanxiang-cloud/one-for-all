import commonjs from '@rollup/plugin-commonjs';
import sucrase from '@rollup/plugin-sucrase';
import styles from 'rollup-plugin-styles';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import copy from 'rollup-plugin-copy';
import path from 'path'

import typescriptPaths from '../../scripts/rollup-plugin-typescript-paths';

const commonPlugins = [
  commonjs(),
  styles({ modules: false }),
  nodeResolve({
    browser: true,
    mainFields: ['main'],
  }),
  typescriptPaths(),
  esbuild({
    // All options are optional
    include: /\.[jt]sx?$/, // default, inferred from `loaders` option
    exclude: /node_modules/, // default
    sourceMap: true,
    minify: process.env.NODE_ENV === 'production',
    target: 'es2017', // default, or 'es20XX', 'esnext'
    jsx: 'transform', // default, or 'preserve'
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    // Like @rollup/plugin-replace
    define: {
      __VERSION__: '"x.y.z"',
    },
    tsconfig: 'tsconfig.json', // default
    // Add extra loaders
    loaders: {
      // Add .json files support
      // require @rollup/plugin-commonjs
      '.json': 'json',
      // Enable JSX in .js files too
      '.js': 'jsx',
    },
  }),
];

const externals = ['react', 'react-dom', "lodash", /@ofa\/.*/];

export default [
  {
    input: 'src/todo-app/components/index.ts',
    output: {
      file: 'dist/todo-app/todo-components.js',
      format: 'system',
      sourcemap: 'inline',
    },

    external: ['react', 'react-dom', /@ofa\/.*/],

    plugins: commonPlugins,
  },
  {
    input: 'src/todo-app/index.ts',
    output: {
      file: 'dist/todo-app/index.js',
      format: 'system',
      sourcemap: 'inline',
    },

    external: ['react', 'react-dom', /@ofa\/.*/],

    plugins: commonPlugins,
  },

  // build for page engine
  {
    input: 'src/page-engine/index.tsx',
    output: {
      file: 'dist/page-engine/index.js',
      format: 'system'
    },

    external: externals,

    plugins: [
      ...commonPlugins,
      copy({
        targets: [
          {src: path.resolve(__dirname, '../ui/dist/images/**/*'), dest: 'dist/images'},
          {src: path.resolve(__dirname, '../ui/assets/images/**/*'), dest: 'dist/images'},
        ],
        copyOnce: true
      })
    ]
  }
];
