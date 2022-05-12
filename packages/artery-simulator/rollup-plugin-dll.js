import path from 'path';
import fs from 'fs';

function isDLL(source) {
  return source.startsWith('dll:');
}
export function dll() {
  return {
    name: 'rollup-plugin-ddl',
    resolveId(source, importer) {
      if (isDLL(source)) {
        return 'dll:' + path.resolve(path.dirname(importer), source.slice(4));
      }
    },
    load(id) {
      if (isDLL(id)) {
        const referenceId = this.emitFile({
          type: 'asset',
          name: path.basename(id),
          source: fs.readFileSync(id.slice(4)),
        });
        return `export default import.meta.ROLLUP_FILE_URL_${referenceId};`;
      }
    },
  };
}
