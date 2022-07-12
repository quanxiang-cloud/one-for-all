import packageJSON from './package.json';
import { terser } from 'rollup-plugin-terser';
import commonPlugins from '../../scripts/common-plugins';

function getOutput(pkgName, pkgVersion) {
  return [
    {
      dir: `dist/${pkgName}@${pkgVersion}`,
      format: 'system',
      entryFileNames: 'index.min.js',
      sourcemap: false,
      plugins: [terser()],
    },
  ];
}


export default {
  input: './index.js',
  output: getOutput(packageJSON.name, packageJSON.version),

  plugins: commonPlugins,
};
