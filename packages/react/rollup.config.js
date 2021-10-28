import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";

import packageJSON from './package.json';

export default [
  {
    input: `src/development.js`,
    output: {
      format: 'system',
      file: `dist/react.${packageJSON.version}.js`,
      sourcemap: 'inline',
      exports: "named",
    },
    plugins: [
      commonjs(),
      resolve(),
      replace({
        values: {
          "process.env.NODE_ENV": '"development"',
        },
      }),
    ],
  },
  {
    input: `src/production.js`,
    output: {
      format: 'system',
      file: `dist/react.${packageJSON.version}.min.js`,
      exports: "named",
    },
    plugins: [
      commonjs(),
      resolve(),
      replace({
        values: {
          "process.env.NODE_ENV": '"production"',
        },
      }),
      terser({
        output: {
          comments(node, comment) {
            return comment.value.trim().startsWith("react@");
          },
        },
      }),
    ],
  }
];
