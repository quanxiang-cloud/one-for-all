import esbuild from 'rollup-plugin-esbuild';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

import typescriptPaths from '../../scripts/rollup-plugin-typescript-paths';
import packageJSON from './package.json';

export default {
  input: 'index.ts',
  output: [
    {
      file: `dist/@ofa/utils@${packageJSON.version}/index.js`,
      format: 'system',
    },
    {
      file: `dist/@ofa/utils@${packageJSON.version}/index.min.js`,
      format: 'system',
      plugins: [terser()],
    }
  ],

  plugins: [
    typescriptPaths(),
    resolve({
      preferBuiltins: false,
      browser: true,
      mainFields: ['module', 'main'],
    }),
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
  ]
};
