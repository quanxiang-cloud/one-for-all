import esbuild from 'rollup-plugin-esbuild';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import replace from '@rollup/plugin-replace'

import typescriptPaths from '../../scripts/rollup-plugin-typescript-paths';
import getOutput from '../../scripts/get-common-output';
import packageJSON from './package.json';

export default {
  input: 'src/index.tsx',
  output: getOutput(packageJSON.name, packageJSON.version),

  external: ['react', 'react-is', /@ofa\/.*/],

  plugins: [
    typescriptPaths(),
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
      jsx: 'transform', // default, or 'preserve'/packages/ui/src/styles/components/dropdown.scss
      define: {
        __VERSION__: '"x.y.z"',
      },
    }),
  ]
};
