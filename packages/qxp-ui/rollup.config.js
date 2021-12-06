import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
// import postcss from 'rollup-plugin-postcss'
import terser from 'rollup-plugin-terser';
import styles from 'rollup-plugin-styles';

const isProd = process.env.NODE_ENV === 'production';
const pkg = require('./package.json');

export default {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'system',
      sourcemap: isProd,
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: isProd,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {
        exclude: ['**/*.stories.*'],
      },
    }),
    // postcss({
    //   extensions: ['.css', '.scss'],
    // }),
    styles(),
    isProd ? terser() : null,
  ].filter(Boolean),
};

