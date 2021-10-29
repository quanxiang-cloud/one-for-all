import packageJSON from './package.json';
import getOutput from '../../scripts/get-common-output';
import commonPlugins from '../../scripts/common-plugins';

const packageName = `${packageJSON.name}@${packageJSON.version}`;

export default {
  input: 'index.js',
  output: getOutput(packageName),

  external: ['react', 'react-dom'],

  plugins: commonPlugins,
};
