import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

export default [
  resolve({
    preferBuiltins: false,
    browser: true,
    mainFields: ['module', 'main'],
  }),
  commonjs(),
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
];
