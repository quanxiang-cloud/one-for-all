import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

import packageJSON from './package.json';

export default {
  input: require.resolve('html-to-draftjs'),
  output: [
    {
      file: `dist/index.${packageJSON.version}.js`,
      format: 'system',
    },
    {
      file: `dist/index.${packageJSON.version}.min.js`,
      format: 'system',
      plugins: [terser()],
    }
  ],

  external: ['react', 'react-dom', 'draft-js'],

  plugins: [
    resolve({
      preferBuiltins: false,
      browser: true,
      mainFields: ['module', 'main'],
    }),
    commonjs(),
  ]
};
