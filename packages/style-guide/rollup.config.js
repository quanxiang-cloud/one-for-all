import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import cssnano from 'cssnano';

import packageJSON from './package.json';

const packageName = `${packageJSON.name}@${packageJSON.version}`;

export default [
  {
    input: 'src/index.css',
    output: {
      file: `dist/${packageName}/index.css`,
      format: 'system',
    },
    plugins: [
      postcss({
        extract: true,
        plugins: [postcssImport()]
      })
    ]
  },
  {
    input: 'src/index.css',
    output: {
      file: `dist/${packageName}/index.min.css`,
      format: 'system',
    },
    plugins: [
      postcss({
        extract: true,
        plugins: [
          postcssImport(),
          cssnano({
            preset: 'default',
          }),
        ]
      })
    ]
  }
]

