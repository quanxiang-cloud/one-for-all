import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import packageJSON from './package.json';

// const packageName = `${packageJSON.name}@${packageJSON.version}`

const lodashConfig = {
  input: require.resolve("lodash"),
  output: [
    {
      dir: "dist",
      entryFileNames: `index.${packageJSON.version}.js`,
      format: "system",
    },
    {
      dir: "dist",
      entryFileNames: `index.${packageJSON.version}.min.js`,
      format: "system",
      plugins: [terser()],
    },
  ],
  plugins: [resolve(), commonjs()],
};

const lodashFPConfig = {
  input: require.resolve("./lodash-fp"),
  external: ["lodash"],
  output: [
    {
      dir: "dist",
      entryFileNames: `fp.${packageJSON.version}.js`,
      format: "system",
    },
    {
      dir: "dist",
      entryFileNames: `fp.${packageJSON.version}.min.js`,
      format: "system",
      plugins: [terser()],
    },
  ],
  plugins: [resolve(), commonjs()],
};

export default [lodashConfig, lodashFPConfig];
