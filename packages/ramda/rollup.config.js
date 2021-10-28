import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

import packageJSON from './package.json';

export default {
  input: 'index.js',
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

  plugins: [
    resolve({
      preferBuiltins: false,
      browser: true,
      mainFields: ['module', 'main'],
    }),
    commonjs(),
  ]
};
