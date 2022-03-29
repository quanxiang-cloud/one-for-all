import path from 'path';
import fs from 'fs';

const matchAssetsReg = /\.(svg|png|jpg|wasm)$/;

function isAssets(source) {
  return matchAssetsReg.test(source);
}

function importMetaAssets() {
  return {
    name: 'import-meta-assets',
    resolveId(source, importer) {
      if (isAssets(source)) {
        return path.resolve(path.dirname(importer), source);
      }
    },
    load(id) {
      if (isAssets(id)) {
        const referenceId = this.emitFile({
          type: 'asset',
          name: path.basename(id),
          source: fs.readFileSync(id)
        });
        return `export default import.meta.ROLLUP_FILE_URL_${referenceId};`;
      }
    }
  };
}

export default importMetaAssets;
