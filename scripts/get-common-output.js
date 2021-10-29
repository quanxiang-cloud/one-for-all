import { terser } from 'rollup-plugin-terser';

export default function getOutput(packageName) {
  return [
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
  ];
}
