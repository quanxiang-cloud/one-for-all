/* eslint-disable @typescript-eslint/no-floating-promises */
import SparkMD5 from 'spark-md5';
const workerContext = self as DedicatedWorkerGlobalScope; // self is the sub thread context

workerContext.onmessage = (e: MessageEvent<{
  blob: File,
  chunkSize: number,
  maxSmallFileSize: number
}>) => {
  calcFileMd5(e.data);
};

async function calcFileMd5(
  data: {blob: File, chunkSize: number, maxSmallFileSize: number}): Promise<void> {
  const { blob, chunkSize, maxSmallFileSize } = data;
  const spark = new SparkMD5.ArrayBuffer();
  const timeStamp = Date.now();

  if (blob.size <= maxSmallFileSize) {
    blob.arrayBuffer().then((buffer: ArrayBuffer) => {
      spark.append(buffer);
      self.postMessage({
        percentage: 100,
        md5: workerContext.btoa(spark.end() + timeStamp),
      });
    });
    return;
  }
  let processPercentage = 0;
  const fileChunks: Blob[] = Array.from(Array(Math.ceil(blob.size / chunkSize))).map((_, index) => {
    const offset = index * chunkSize;
    return blob.slice(offset, offset + chunkSize, blob.type);
  });
  const percentPerChunk = 100 / fileChunks.length;

  for (const chunk of fileChunks[Symbol.iterator]()) {
    try {
      spark.append(await chunk.arrayBuffer());
      processPercentage += percentPerChunk;
      self.postMessage({
        percentage: Math.floor(processPercentage),
      });
    } catch (error) {
      workerContext.close();
    }
  }

  self.postMessage({
    fileChunks,
    percentage: 100,
    md5: workerContext.btoa(spark.end() + timeStamp),
  });
}

workerContext.onerror = () => {
  workerContext.close();
};

export default null as any;
