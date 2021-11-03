import { terser } from 'rollup-plugin-terser';

export default function getOutput(pkgName) {
  return [
    {
      file: `dist/${pkgName}/index.js`,
      format: 'system',
      sourcemap: 'inline',
    },
    {
      file: `dist/${pkgName}/index.min.js`,
      format: 'system',
      sourcemap: false,
      plugins: [terser()],
    },
  ];
}
