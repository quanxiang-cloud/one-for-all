import { terser } from 'rollup-plugin-terser';

export default function getOutput(pkgName, pkgVersion) {
  return [
    {
      file: `dist/${pkgName}@${pkgVersion}/index.js`,
      format: 'system',
      sourcemap: 'inline',
    },
    {
      file: `dist/${pkgName}@${pkgVersion}/index.min.js`,
      format: 'system',
      sourcemap: false,
      plugins: [terser()],
    },
    {
      file: `dist/${pkgName}@latest/index.js`,
      format: 'system',
      sourcemap: 'inline',
    },
    {
      file: `dist/${pkgName}@latest/index.min.js`,
      format: 'system',
      sourcemap: false,
      plugins: [terser()],
    },
  ];
}
