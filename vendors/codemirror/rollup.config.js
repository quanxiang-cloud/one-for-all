import resolve from '@rollup/plugin-node-resolve';
import styles from 'rollup-plugin-styles';
import commonjs from '@rollup/plugin-commonjs';
import getOutput from '../../common/config/rollup/get-common-output';
import packageJSON from './package.json';

export default {
  input: 'index.js',
  output: getOutput(packageJSON.name, packageJSON.version),
  external: ['react', 'react-dom'],
  plugins: [
    commonjs(),
    styles({ modules: false }),
    resolve({
      preferBuiltins: false,
      browser: true,
      mainFields: ['module', 'main'],
    }),
  ],
};
