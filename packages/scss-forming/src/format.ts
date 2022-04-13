import prettierWorker from './prettier-worker';

const worker = new Worker(URL.createObjectURL(new Blob([prettierWorker])));

function format(scssStr: string): Promise<string> {
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

export default format;
