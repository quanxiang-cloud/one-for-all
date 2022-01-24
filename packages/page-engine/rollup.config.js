import esbuild from 'rollup-plugin-esbuild';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
// import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import styles from 'rollup-plugin-styles';
// import alias from '@rollup/plugin-alias'
// import path from 'path'
import replace from '@rollup/plugin-replace'

import typescriptPaths from '../../scripts/rollup-plugin-typescript-paths';
import getOutput from '../../scripts/get-common-output';
import packageJSON from './package.json';

export default {
  input: 'src/index.ts',
  output: getOutput(packageJSON.name, packageJSON.version),

  external: ['react', 'react-dom', 'react-is', 'lodash', /@one-for-all\/.+/],

  plugins: [
    // peerDepsExternal(),
    typescriptPaths(),
    // alias({
    //   entries: {
    //     '@one-for-all/page-engine': path.resolve(__dirname, './lib/src/'),
    //   },
    // }),
    resolve({
      preferBuiltins: false,
      browser: true,
      mainFields: ['module', 'main'],
    }),
    commonjs(),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    esbuild({
      // All options are optional
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: true, // default
      minify: process.env.NODE_ENV === 'production',
      target: 'es2017', // default, or 'es20XX', 'esnext'
      jsx: 'transform', // default, or 'preserve'
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
    }),
  ]
};
