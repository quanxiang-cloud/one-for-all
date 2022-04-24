import esbuild from 'rollup-plugin-esbuild';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import styles from 'rollup-plugin-styles';
import replace from '@rollup/plugin-replace';

import typescriptPaths from '../../common/config/rollup/rollup-plugin-typescript-paths';
import packageJSON from './package.json';

function getOutput(pkgName, pkgVersion, filename) {
  return [
    {
      file: `dist/${pkgName}@${pkgVersion}/${filename}.js`,
      format: 'system',
      sourcemap: 'inline',
      assetFileNames: '[name][extname]',
    },
    {
      file: `dist/${pkgName}@${pkgVersion}/${filename}.min.js`,
      format: 'system',
      sourcemap: false,
      plugins: [terser()],
      assetFileNames: '[name][extname]',
    },
    {
      file: `dist/${pkgName}@latest/${filename}.js`,
      format: 'system',
      sourcemap: 'inline',
      assetFileNames: '[name][extname]',
    },
    {
      file: `dist/${pkgName}@latest/${filename}.min.js`,
      format: 'system',
      sourcemap: false,
      plugins: [terser()],
      assetFileNames: '[name][extname]',
    },
  ];
}

function getCommonConfigs(side) {
  return {
    external: ['react', 'react-dom', 'react-is', 'lodash', /@one-for-all\/.*/],

    plugins: [
      // peerDepsExternal(),
      typescriptPaths(),
      resolve({
        preferBuiltins: false,
        browser: true,
        mainFields: ['module', 'main'],
      }),
      commonjs(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      esbuild({
        // All options are optional
        include: /\.[jt]sx?$/, // default, inferred from `loaders` option
        exclude: /node_modules/, // default
        sourceMap: true, // default
        minify: process.env.NODE_ENV === 'production',
        target: 'es2017', // default, or 'es20XX', 'esnext'
        jsx: 'transform', // default, or 'preserve'/packages/ui/src/styles/components/dropdown.scss
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
        // Like @rollup/plugin-replace
        define: {
          __VERSION__: '"x.y.z"',
        },
        tsconfig: 'tsconfig.json', // default
        // Add extra loaders
        loaders: {
          // Add .json files support
          // require @rollup/plugin-commonjs
          '.json': 'json',
          // Enable JSX in .js files too
          '.js': 'jsx',
        },
      }),
      styles({
        autoModules: /\.m\.scss/,
        // mode: ["extract", "ofa-ui.css"]
        mode: 'extract',
        mode: ['extract', `ofa-headless-ui-${side}.css`],
      }),
    ],
  };
}

export default [
  {
    input: 'src/web/index.ts',
    output: getOutput(packageJSON.name, packageJSON.version, 'web'),
    ...getCommonConfigs('web'),
  },
  {
    input: 'src/mobile/index.ts',
    output: getOutput(packageJSON.name, packageJSON.version, 'mobile'),
    ...getCommonConfigs('mobile'),
  },
];
