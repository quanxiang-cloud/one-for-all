import fs from 'fs';
import commonjs from '@rollup/plugin-commonjs';
import styles from 'rollup-plugin-styles';
import esbuild from 'rollup-plugin-esbuild';
import html from '@rollup/plugin-html';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import typescriptPaths from '../../scripts/rollup-plugin-typescript-paths';

export default [
  // {
  //   input: {
  //     index: 'src/index.ts',
  //     outline: 'src/outline.tsx',
  //     temporaryPlugins: 'src/artery-simulator/temporary-plugins.ts',
  //   },
  //   output: {
  //     dir: 'dist',
  //     format: 'system',
  //     sourcemap: 'inline',
  //   },

  //   external: ['react', 'react-dom', 'lodash', /@one-for-all\/.*/],

  //   plugins: [
  //     commonjs(),
  //     styles({ modules: false }),
  //     nodeResolve({
  //       browser: true,
  //       mainFields: ['main'],
  //     }),
  //     typescriptPaths(),
  //     esbuild({
  //       // All options are optional
  //       include: /\.[jt]sx?$/, // default, inferred from `loaders` option
  //       exclude: /node_modules/, // default
  //       sourceMap: true,
  //       minify: process.env.NODE_ENV === 'production',
  //       target: 'es2017', // default, or 'es20XX', 'esnext'
  //       jsx: 'transform', // default, or 'preserve'
  //       jsxFactory: 'React.createElement',
  //       jsxFragment: 'React.Fragment',
  //       // Like @rollup/plugin-replace
  //       define: {
  //         __VERSION__: '"x.y.z"',
  //       },
  //       tsconfig: 'tsconfig.json', // default
  //       // Add extra loaders
  //       loaders: {
  //         // Add .json files support
  //         // require @rollup/plugin-commonjs
  //         '.json': 'json',
  //         // Enable JSX in .js files too
  //         '.js': 'jsx',
  //       },
  //     }),
  //   ],
  // },
  // config for todo-app
  {
    input: 'src/todo-app/index.ts',
    output: {
      dir: 'dist/todo',
      format: 'system',
      sourcemap: 'inline',
    },

    external: ['react', 'react-dom', 'lodash', /@one-for-all\/.*/],

    plugins: [
      commonjs(),
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
