import packageJSON from './package.json';
import getOutput from '../../scripts/get-common-output';
import commonPlugins from '../../scripts/common-plugins';

const packageName = `${packageJSON.name}@${packageJSON.version}`;

export default {
  input: require.resolve('jszip'),
  output: getOutput(packageName),

  plugins: commonPlugins,
};
