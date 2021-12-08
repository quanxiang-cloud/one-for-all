import commonjs from '@rollup/plugin-commonjs';
import sucrase from '@rollup/plugin-sucrase';
import styles from 'rollup-plugin-styles';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';

import typescriptPaths from '../../scripts/rollup-plugin-typescript-paths';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/todo.js',
      format: 'system'
    },

    external: ['react', 'react-dom', /@ofa\/.*/],

    plugins: [
      commonjs(),
      styles({ modules: false }),
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

    external: ['react', 'react-dom', /@ofa\/.*/],

    plugins: [
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
        sourceMap: false, // default
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
      // sucrase({
      //   exclude: ['node_modules/**'],
      //   transforms: ['typescript', 'jsx'],
      //   production: true
      // }),
    ]
  },

  // build for page engine
  {
    input: 'src/page-engine/index.tsx',
    output: {
      file: 'dist/page-engine/index.js',
      format: 'system'
    },

    external: ['react', 'react-dom', /@ofa\/.*/],

    plugins: [
      commonjs(),
      styles({ modules: false }),
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
