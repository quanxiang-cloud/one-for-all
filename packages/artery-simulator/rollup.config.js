import esbuild from 'rollup-plugin-esbuild';
import styles from 'rollup-plugin-styles';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import typescriptPaths from '../../common/config/rollup/rollup-plugin-typescript-paths';
import getOutput from '../../common/config/rollup/get-common-output';
import packageJSON from './package.json';

export default {
  input: 'src/index.tsx',
  output: getOutput(packageJSON.name, packageJSON.version),

  external: ['react', 'react-dom', 'rxjs', /@one-for-all\/.*/, /rxjs\/.*/, 'react-jsx-parser', 'history'],

  plugins: [
    commonjs(),
    typescriptPaths(),
    styles({ modules: false }),
    resolve({
      preferBuiltins: false,
      browser: true,
      mainFields: ['module', 'main'],
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
  ],
};
