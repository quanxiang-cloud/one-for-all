import esbuild from 'rollup-plugin-esbuild-ts';
import styles from 'rollup-plugin-styles';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

const NODE_ENV = process.env.NODE_ENV === 'production' ? 'production' : 'dev';
const isProduction = NODE_ENV === 'production';


export default {
  input: 'src/simulator/index.tsx',
  output: {
    file: 'dll/simulator.js',
    format: 'system',
    sourcemap: 'inline',
  },

  external: ['react', 'react-dom', 'lodash', /@one-for-all\/.*/],

  plugins: [
    commonjs(),
    styles({ modules: false }),
    resolve({
      preferBuiltins: false,
      browser: true,
      mainFields: ['module', 'main'],
    }),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
    }),
    esbuild({
      // All options are optional
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: isProduction ? false : true, // default
      minify: isProduction,
      target: 'es2019', // default, or 'es20XX', 'esnext'
      jsx: 'transform', // default, or 'preserve'
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      // Like @rollup/plugin-replace
      define: {
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'dev'),
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
