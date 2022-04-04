import resolve from '@rollup/plugin-node-resolve';

import getOutput from '../../common/config/rollup/get-common-output';
import packageJSON from './package.json';

export default {
  input: 'src/index.js',
  output: getOutput(packageJSON.name, packageJSON.version),

  external: [/@one-for-all\/.*/],

  plugins: [
    resolve({
      preferBuiltins: false,
      browser: true,
      mainFields: ['module', 'main'],
    }),
  ],
};
