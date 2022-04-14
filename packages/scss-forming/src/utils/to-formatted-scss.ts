import postcss from 'postcss';
import { AST } from '../types';
import prettierWorker from './prettier-worker';

const worker = new Worker(URL.createObjectURL(new Blob([prettierWorker])));

function toFormattedSCSS(ast: AST): Promise<string> {
  const scssStr = postcss.fromJSON(ast).toString();

  return new Promise((resolve, reject) => {
    worker.onmessage = ({ data }) => {
      resolve(data);
    };

    worker.onerror = (e) => {
      reject(e);
    };

    worker.postMessage(scssStr);
  });
}

export default toFormattedSCSS;
