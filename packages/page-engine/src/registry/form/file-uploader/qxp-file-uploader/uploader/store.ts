/* eslint-disable require-atomic-updates */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/member-ordering */
import { observable, action, makeObservable } from 'mobx';
import { uniqueId } from 'lodash';

import { toast } from '@one-for-all/ui';
import { httpClient, isAcceptedFileType } from '../utils';

import Md5Worker from '../utils/md5.worker';
import smallFileUploadRequest from './small-file-upload-stream';
import bigFileMultipartUpload, { FileUploadStreamProps } from './large-file-part-upload-stream';

import {
  CHUNK_SIZE,
  MAX_SMALL_FILE_SIZE,
  SMALL_FILE_SIGN_API,
  BIG_FILE_SIGN_API,
  FILE_DELETE_API,
  ABORT_MULTIPART_API,
  DEFAULT_IMG_TYPES,
  THUMBNAIL_SIZE,
  IMG_THUMBNAIL_API,
} from '../constants';

export interface FileStoreProps {
  files: QXPUploadFileBaseProps[],
  fileBucket: string;
  requestThumbnail?: boolean;
  additionalPathPrefix?: string;
  onSuccess?: (file: QXPUploadFileTask) => void,
  onError?: (err: Error, file: QXPUploadFileTask) => void,
}
class FileStore {
  pageID: string | undefined;
  isPrivate: boolean | undefined;
  fileBucket: string;
  requestThumbnail: boolean | undefined;
  additionalPathPrefix: string;
  appID?: string;
  onSuccess?: (file: QXPUploadFileTask) => void;
  onError?: (err: Error, file: QXPUploadFileTask) => void;
  
  @observable files: QXPUploadFileTask[];
  @observable fileRequests: Record<string, (() => void) | null> = {};

  constructor(props: FileStoreProps) {
    this.files = props.files;
    this.fileBucket = props.fileBucket;
    this.additionalPathPrefix = props.additionalPathPrefix || '';
    this.requestThumbnail = props.requestThumbnail;
    this.onSuccess = props.onSuccess;
    this.onError = props.onError;
    makeObservable(this);
  }

  

  @action
  addUploadFile = (fileItem: QXPUploadFileTask): void => {
    this.files = [...this.files, fileItem];
  };

  @action
  removeUploadFile = (deleteFile: QXPUploadFileTask): void => {
    this.abortFile(deleteFile);
    if (deleteFile.uploadID && deleteFile.state !== 'success') {
      httpClient(ABORT_MULTIPART_API, {
        path: `${this.fileBucket}/${deleteFile.uid}`,
        uploadID: deleteFile.uploadID,
      });
    }
    httpClient(FILE_DELETE_API, {
      path: `${this.fileBucket}/${deleteFile.uid}`,
    });
    this.files = this.files.filter((file) => file.name !== deleteFile.name);
  };

  @action
  getUploadFile = (fileName: string): QXPUploadFileTask | undefined => {
    return this.files.find((file) => file.name === fileName);
  };

  @action
  updateUploadFile = (fileName: string, data: Partial<QXPUploadFileTask>): QXPUploadFileTask => {
    const fileIndex = this.files.findIndex((file) => file.name === fileName);
    this.files[fileIndex] = { ...this.files[fileIndex], ...data };
    return this.files[fileIndex];
  };

  @action
  clearUploadFiles = (): void => {
    this.files = [];
  };

  @action
  prepareFilesUpload = (files: File[]): void => {
    const extendedFiles: QXPUploadFileTask[] = files.map((file: File) => ({
      name: file.name,
      uid: uniqueId('qxp-file/'), // Use uuid as a temp uid for key props in file list render, and it will be replaced after file signed
      size: file.size,
      type: file.type || 'application/octet-stream',
      blob: file,
    }));

    extendedFiles.forEach((file) => {
      this.addUploadFile(file);
      this.calcFileMD5(file).then(this.startUploadFile);
    });
  };

  startUploadFile = (fileWithMd5: QXPUploadFileTask): void => {
    this.signFile(fileWithMd5).then((signedFile) => {
      this.putFileStream(signedFile);
    }).catch((err) => {
      this.onFileUploadError(err, fileWithMd5);
    });
  };

  calcFileMD5 = (
    file: QXPUploadFileTask,
  ): Promise<QXPUploadFileTask> => {
    return new Promise((resolve, reject) => {
      const { blob } = file;
      const worker = new Md5Worker();
      file.md5Worker = worker;
      worker.postMessage({ blob, chunkSize: CHUNK_SIZE, maxSmallFileSize: MAX_SMALL_FILE_SIZE });
      worker.onmessage = (e: MessageEvent<{ percentage: number, md5: string, fileChunks: Blob[] }>) => {
        const { percentage, md5, fileChunks } = e.data;
        if (fileChunks) {
          file.fileChunks = fileChunks.map((chunk: Blob, index: number) => {
            return {
              partNumber: index + 1,
              chunkBlob: chunk,
            };
          });
        }
        if (percentage) {
          file.progress = percentage;
        }
        if (md5) {
          file.md5 = md5;
          resolve(file);
          worker.terminate();
        }
        file.state = 'processing';
        this.updateUploadFile(file.name, file);
        return;
      };
      worker.onerror = (error: ErrorEvent) => {
        reject(error);
      };
    });
  };

  signFile = (file: QXPUploadFileTask): Promise<QXPUploadFileTask> => {
    const { md5 } = file;
    if (!md5) throw Error('no file md5 provided.');
    const fileSignPath = [];
    const fileUid = [md5, file.name];
    const signUrl = file.size >= MAX_SMALL_FILE_SIZE ? BIG_FILE_SIGN_API : SMALL_FILE_SIGN_API;

    this.updateUploadFile(file.name, file);

    fileSignPath.push(this.fileBucket);

    this.additionalPathPrefix && fileUid.unshift(this.additionalPathPrefix);

    fileSignPath.push(...fileUid);

    return httpClient(signUrl, {
      contentType: file.type,
      path: fileSignPath.join('/'),
    }).then((response) => {
      const { url, uploadID } = response as { url?: string, uploadID?: string };
      const signedFile = this.updateUploadFile(file.name, {
        uid: fileUid.join('/'),
        uploadID,
        uploadUrl: url,
      });
      return signedFile;
    });
  };

  @action
  putFileStream = (file: QXPUploadFileTask): void => {
    const fileUploadStreamRequest = file.size > MAX_SMALL_FILE_SIZE ?
      bigFileMultipartUpload : smallFileUploadRequest;
    const putFileData: FileUploadStreamProps = {
      file,
      fileBucket: this.fileBucket,
      onSuccess: this.onFileUploadSuccess,
      onProgress: this.onFileUploading,
      onError: this.onFileUploadError,
    };
    this.fileRequests[file.uid] = fileUploadStreamRequest(putFileData);
  };

  @action
  retryUploadFile = (file: QXPUploadFileTask): void => {
    const { name } = file;
    const retryFile = this.getUploadFile(name);
    if (!retryFile) {
      return;
    }
    this.putFileStream(retryFile);
  };

  @action
  abortFile = (abortFile?: QXPUploadFileTask): void => {
    if (!abortFile) return;
    abortFile?.md5Worker?.terminate();
    this.fileRequests[abortFile.uid]?.();
  };

  @action
  abortAllFiles = (): void => {
    this.files.forEach((file: QXPUploadFileTask) => {
      if (file.state === 'uploading' || file.state === 'processing') {
        file.md5Worker?.terminate();
        this.fileRequests[file.uid]?.();
      }
    });
  };

  onFileUploadError = (err: Error, file: QXPUploadFileTask): void => {
    file.state = 'failed';
    toast.error(err.message);
    this.updateUploadFile(file.name, file);
    this.onError?.(err, file);
  };

  onFileUploadSuccess = async (file: QXPUploadFileTask): Promise<void> => {
    const { uid, name } = file;
    if (isAcceptedFileType(file, DEFAULT_IMG_TYPES.toLocaleString()) && this.requestThumbnail) {
      await httpClient(IMG_THUMBNAIL_API, {
        path: `${this.fileBucket}/${file.uid}`,
        width: THUMBNAIL_SIZE / 2,
      });
    }
    file.state = 'success';
    file.md5Worker = null;
    file.fileChunks = null;
    this.fileRequests[uid] = null;
    this.updateUploadFile(name, file);
    this.onSuccess?.(file);
  };

  onFileUploading = (file: QXPUploadFileTask, progress: number): void => {
    file.state = 'uploading';
    file.progress = progress;
    this.updateUploadFile(file.name, file);
  };
}

export default FileStore;
