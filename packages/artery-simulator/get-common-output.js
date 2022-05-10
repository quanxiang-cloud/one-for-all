import { terser } from 'rollup-plugin-terser';

export default function getOutput(pkgName, pkgVersion) {
  return [
    {
      dir: `dist/${pkgName}@${pkgVersion}`,
      format: 'system',
      sourcemap: 'inline',
    },
    // {
    //   dir: `dist/${pkgName}@${pkgVersion}`,
    //   format: 'system',
    //   sourcemap: false,
    //   plugins: [terser()],
    // },
    {
      dir: `dist/${pkgName}@latest`,
      format: 'system',
      sourcemap: 'inline',
    },
    // {
    //   dir: `dist/${pkgName}@latest`,
    //   format: 'system',
    //   sourcemap: false,
    //   plugins: [terser()],
    // },
  ];
}
