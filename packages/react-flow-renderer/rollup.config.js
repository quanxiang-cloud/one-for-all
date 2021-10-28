import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import replace from '@rollup/plugin-replace'

import packageJSON from './package.json';

export default {
  input: require.resolve('react-flow-renderer'),
  output: [
    {
      file: `dist/index.${packageJSON.version}.js`,
      format: 'system',
      sourcemap: true,
    },
    {
      file: `dist/index.${packageJSON.version}.min.js`,
      format: 'system',
      plugins: [terser()],
    }
  ],

  external: ['react', 'react-dom'],

  plugins: [
    resolve({
      preferBuiltins: false,
      browser: true,
      mainFields: ['module', 'main'],
    }),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
  ]
};
