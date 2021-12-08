import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';

import packageJSON from './package.json';

const packageName = `${packageJSON.name}@${packageJSON.version}`;

export default {
  input: 'src/index.css',
  output: {
    file: `dist/${packageName}/style.css`,
    format: 'system'
  },
  plugins: [
    postcss({
      extract: true,
      plugins: [postcssImport()]
    })
  ]
}

