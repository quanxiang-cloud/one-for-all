import postcss from 'rollup-plugin-postcss';
import esbuild from 'rollup-plugin-esbuild';
import postcssImport from 'postcss-import';
import cssnano from 'cssnano';
import path from 'path';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';

import importMetaAssets from '../../common/config/rollup/rollup-plugin-import-meta-assets';
import commonPlugins from '../../scripts/common-plugins';
import packageJSON from './package.json';

const packageName = `${packageJSON.name}@${packageJSON.version}`;
const modes = ['web', 'mobile'];

const cssConfig = modes.reduce((acc, mode) => {
  return [
    ...acc,
    {
      input: `src/css/${mode}/index.css`,
      output: {
        file: `dist/${packageName}/css/${mode}.css`,
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
      input: `src/css/${mode}/index.css`,
      output: {
        file: `dist/${packageName}/css/${mode}.min.css`,
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
    },
  ]
}, [])

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: `dist/${packageName}/index.js`,
        format: 'system',
        sourcemap: 'inline',
      },
      {
        file: `dist/${packageName}/index.min.js`,
        format: 'system',
        sourcemap: false,
        plugins: [terser()],
      },
    ],
    plugins: [
      importMetaAssets(),
      esbuild({
        // All options are optional
        // include: /\.[jt]sx?$/, // default, inferred from `loaders` option
        exclude: /node_modules/, // default
        sourceMap: true, // default
        minify: process.env.NODE_ENV === 'production',
        target: 'es2017', // default, or 'es20XX', 'esnext'
        jsx: 'transform', // default, or 'preserve'
        // Like @rollup/plugin-replace
        define: {
          __VERSION__: '"x.y.z"',
        },
        tsconfig: 'tsconfig.json', // default
      }),
      copy({
        targets: [
          { src: path.resolve(__dirname, './src/assets/*'), dest: `dist/${packageName}` },
        ],
        copyOnce: true
      }),
      ...commonPlugins,
    ]
  },
  ...cssConfig,
]

