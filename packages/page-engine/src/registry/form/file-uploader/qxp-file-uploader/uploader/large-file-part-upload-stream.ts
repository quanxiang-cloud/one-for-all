
import { httpClient,createQueue } from '../utils';

import {
  CHUNK_SIZE,
  PARALLEL_UPLOAD_SIZE,
  GET_MULTIPART_LIST_API,
  FILE_PART_SIGN_API,
  COMPLETE_MULTIPART_API,
  FINISH_FILE_UPLOAD_API,
} from '../constants';

export interface FileUploadStreamProps {
  file: QXPUploadFileTask;
  fileBucket: string;
  onError?: (err: Error, file: QXPUploadFileTask) => void;
  onSuccess?: (file: QXPUploadFileTask) => void
  onProgress?: (file: QXPUploadFileTask, progress: number,) => void;
}

interface QxpFilePartBlob {
  chunkBlob: Blob;
  partNumber: number;
}

export default function fileMultiPartUpload({
  file,
  fileBucket,
  onError,
  onProgress,
  onSuccess,
}: FileUploadStreamProps): () => void {
  const { uid, uploadID, fileChunks, size } = file;
  const path = `${fileBucket}/${file.uid}`;
  const percentPreChunk = 100 / Math.ceil(size / CHUNK_SIZE);
  let totalProgress = 0;

  if (!uid && !uploadID && fileChunks) throw new Error('No path or uploadID provided');

  const fetchAbortController: AbortController = new AbortController();

  const generatePartUploadTask = (partNumber: number, filePart: QxpFilePartBlob): () => Promise<void> => {
    const { chunkBlob } = filePart;
    return () => new Promise((resolve, reject) => {
      const { type } = chunkBlob;
      httpClient(FILE_PART_SIGN_API, {
        path,
        partNumber,
        uploadID,
      }).then((res: any) => {
        if (!res) throw new Error('file part sign request failed');
        return res.url;
      }).then((url: string) => {
        return fetch(url,
          {
            method: 'PUT',
            headers: {
              'Content-Type': type || file.type,
            },
            body: chunkBlob,
            signal: fetchAbortController.signal,
          },
        );
      }).then(() => {
        totalProgress += percentPreChunk;
        file.progress = Math.floor(totalProgress);
        onProgress?.(file, Math.floor(totalProgress));
        resolve();
      }).catch((reason) => {
        reject(reason);
      });
    });
  };

  httpClient<{ parts: number[] }>(GET_MULTIPART_LIST_API, {
    uploadID,
    path,
  }).then(({ parts }) => {
    if (!parts) throw new Error('no file parts info provided');

    totalProgress = parts.length * percentPreChunk;
    onProgress?.(file, Math.floor(totalProgress));
    const unUploadChunks = fileChunks?.filter((chunk) => !parts.includes(chunk.partNumber));
    return unUploadChunks;
  }).then((unUploadChunks) => {
    if (!unUploadChunks?.length) {
      onSuccess?.(file);
      return;
    }
    const fileChunksPromise = unUploadChunks.map((chunk) => generatePartUploadTask(chunk.partNumber, chunk));

    return createQueue(fileChunksPromise, PARALLEL_UPLOAD_SIZE);
  }).then(() => {
    return httpClient(COMPLETE_MULTIPART_API, {
      uploadID,
      path,
    });
  }).then(() => {
    return httpClient(FINISH_FILE_UPLOAD_API, { path });
  }).then(() => {
    onSuccess?.(file);
  }).catch((error) => {
    onError?.(error, file);
  });

  return () => {
    onError?.(new Error(`已经取消 ${file.name} 的上传`), file);
    fetchAbortController.abort();
  };
}

