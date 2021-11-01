import packageJSON from './package.json';
import getOutput from '../../scripts/get-common-output';
import commonPlugins from '../../scripts/common-plugins';

const packageName = `${packageJSON.name}@${packageJSON.version}`;

export default {
  input: require.resolve('draftjs-utils'),

  output: getOutput(packageName),

  external: ['react', 'react-dom', 'draft-js'],

  plugins: commonPlugins,
};
