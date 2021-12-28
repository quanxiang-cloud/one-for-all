import packageJSON from './package.json';
import getOutput from '../../scripts/get-common-output';
import commonPlugins from '../../scripts/common-plugins';

export default {
  input: require.resolve('quill'),
  output: getOutput(packageJSON.name, packageJSON.version),

  plugins: commonPlugins,
};
