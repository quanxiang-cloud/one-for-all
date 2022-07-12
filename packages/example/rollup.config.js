import fs from 'fs';
import commonjs from '@rollup/plugin-commonjs';
import styles from 'rollup-plugin-styles';
import esbuild from 'rollup-plugin-esbuild';
import html from '@rollup/plugin-html';
import replace from '@rollup/plugin-replace';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

import typescriptPaths from '../../scripts/rollup-plugin-typescript-paths';

const external = ['react', 'react-dom', 'lodash', /@one-for-all\/.*/];

export default [
  {
    input: {
      index: 'src/index.ts',
      outline: 'src/outline.tsx',
      temporaryPlugins: 'src/artery-simulator/temporary-plugins.ts',
    },
    output: {
      dir: 'dist',
      format: 'system',
      sourcemap: 'inline',
    },

    external,

    plugins: [
      commonjs(),
      styles({ modules: false }),
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }),
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
    ],
  },
  // config for todo-app
  {
    input: 'src/todo-app/index.ts',
    output: {
      dir: 'dist/todo',
      format: 'system',
      plugins: [terser()],
    },

    external,

    plugins: [
      commonjs(),
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }),
      styles({ modules: false }),
      nodeResolve({
        browser: true,
        mainFields: ['main'],
      }),
      typescriptPaths(),
      html({
        fileName: 'index.html',
        template: ({ files, publicPath }) => {
          const scripts = (files.js || []).map(({ fileName }) => `<script src="${publicPath}${fileName}"></script>`).join('\n');
          // const links = (files.css || []).map(({ fileName }) => `<link href="${publicPath}${fileName}" rel="stylesheet">`).join('\n');
          const todoTemplate = fs.readFileSync('./todo-app.html', { encoding:'utf8', flag:'r' });
          return todoTemplate.replace('__SCRIPT__PLACEHOLDER__', scripts)
        },
      }),
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
          'process.env.NODE_ENV': 'production',
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
    ],
  }
];
