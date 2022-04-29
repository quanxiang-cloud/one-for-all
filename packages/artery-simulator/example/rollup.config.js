import commonjs from '@rollup/plugin-commonjs';
import styles from 'rollup-plugin-styles';
import esbuild from 'rollup-plugin-esbuild-ts';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  // {
  //   input: 'src/todo-app/components/index.ts',
  //   output: {
  //     file: 'dist/todo-app/todo-components.js',
  //     format: 'system',
  //     sourcemap: 'inline',
  //   },

  //   external: ['react', 'react-dom', /@one-for-all\/.*/],

  //   plugins: commonPlugins,
  // },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'system',
      sourcemap: 'inline',
    },

    external: ['react', 'react-dom', 'lodash', /@one-for-all\/.*/],

    plugins: [
      commonjs(),
      styles({ modules: false }),
      nodeResolve({
        browser: true,
        mainFields: ['main'],
      }),
      esbuild({
        // All options are optional
        include: /\.[jt]sx?$/, // default, inferred from `loaders` option
        exclude: /node_modules/, // default
        sourceMap: true,
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
  },
];

// {
//   input: 'src/component-style-config/index.tsx',
//   output: {
//     file: 'dist/component-style-config/index.js',
//     format: 'system',
//     sourcemap: 'inline',
//   },

//   external: ['react', 'react-dom', /@one-for-all\/.*/],

//   plugins: [
//     ...commonPlugins,
//     copy({
//       targets: [
//         { src: path.resolve(__dirname, './src/component-style-config/assets/*'), dest: 'dist/component-style-config' },
//       ],
//       copyOnce: true
//     })
//   ],
// },
