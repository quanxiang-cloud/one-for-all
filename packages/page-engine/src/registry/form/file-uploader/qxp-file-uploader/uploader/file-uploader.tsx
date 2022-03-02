import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import cs from 'classnames';

import { toast } from '@one-for-all/ui';
import { isAcceptedFileType, isMacosX } from '../utils';

import FileList from '../file-list';
import FilePicker from './file-picker';
import useFileStore from './useFileStore';
import { OSS_PRIVATE_BUCKET_NAME, OSS_PUBLIC_BUCKET_NAME } from '../constants';

export interface FileUploaderProps {
  name?: string;
  limit?: number;
  accept?: string;
  iconName?: string;
  isPrivate?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  maxFileSize?: number;
  style?: React.CSSProperties;
  additionalPathPrefix?: string;
  uploaderDescription?: React.ReactNode;
  fileData?: QXPUploadFileBaseProps[];
  children?: React.ReactNode;
  onFileDelete?: (file: QXPUploadFileBaseProps) => void;
  onFileSuccess?: (file: QXPUploadFileBaseProps) => void;
  onFileError?: (err: Error, file: QXPUploadFileBaseProps) => void;
  onFileAbort?: (file: QXPUploadFileBaseProps | QXPUploadFileBaseProps[]) => void;
}

function FileUploader({
  name,
  limit,
  style,
  multiple,
  disabled,
  iconName,
  className,
  accept,
  children,
  maxFileSize,
  fileData = [],
  isPrivate = true,
  uploaderDescription,
  additionalPathPrefix,
  onFileError,
  onFileAbort,
  onFileDelete,
  onFileSuccess,
}: FileUploaderProps): JSX.Element {
  const fileStore = useFileStore({
    fileBucket: isPrivate ? OSS_PRIVATE_BUCKET_NAME : OSS_PUBLIC_BUCKET_NAME,
    files: fileData,
    additionalPathPrefix,
    onError: onFileError,
    onSuccess: onFileSuccess,
  });

  const {
    files: storeFiles,
    prepareFilesUpload,
    retryUploadFile,
    abortAllFiles,
    clearUploadFiles,
    removeUploadFile,
  } = fileStore;

  useEffect(() => {
    return () => {
      abortAllFiles();
      clearUploadFiles();
    };
  }, []);


  function deleteFileItem(deleteFile: QXPUploadFileTask): void {
    deleteFile.state === 'success' || !deleteFile.state ?
      onFileDelete?.(deleteFile) : onFileAbort?.(deleteFile);
    removeUploadFile(deleteFile);
  }

  function beforeUpload(preUploadFile: File, files: File[], storeFiles: QXPUploadFileBaseProps[]): boolean {
    const byteSize = isMacosX ? 1000 : 1024;
    const maxSize = (byteSize ** 2) * (maxFileSize || 0);

    if (limit && limit <= storeFiles.length) {
      toast.error(`文件数量不可超过 '${limit}' 个`);
      return false;
    }

    if (accept && !isAcceptedFileType(preUploadFile, accept)) {
      toast.error(`文件 '${preUploadFile.name}' 的格式不正确`);
      return false;
    }

    if (storeFiles.find((file) => file.name === preUploadFile.name)) {
      toast.error(`已存在名为'${preUploadFile.name}' 的文件。`);
      return false;
    }
    if (!multiple && (files.length !== 1 || storeFiles.length === 1)) {
      toast.error('仅允许上传一个附件');
      return false;
    }

    if (multiple) {
      const preUploadTotalSize = files.reduce((total, currFile) => (total + currFile.size), 0);
      const uploadedTotalSize = storeFiles.reduce((total: number, currFile: { size: number; }) =>
        (total + currFile.size), preUploadTotalSize);
      if (maxSize && uploadedTotalSize > maxSize) {
        toast.error(`文件总大小不能超过${maxFileSize}MB`);
        return false;
      }
    }

    if (maxSize && preUploadFile.size > maxSize) {
      toast.error(`单个文件大小不能超过${maxFileSize}MB`);
      return false;
    }
    return true;
  }

  return (
    <div
      className={cs('qxp-file-uploader', className)}
      style={style}
    >
      <FilePicker
        name={name}
        className="w-full h-56 p-10"
        multiple={multiple}
        iconName={iconName}
        accept={accept}
        disabled={disabled || (!multiple && storeFiles.length >= 1)}
        description={(!multiple && storeFiles.length >= 1) ? '只能上传一个文件' : uploaderDescription}
        onSelectFiles={(files) => {
          files.every((file) => beforeUpload(file, files, storeFiles)) && prepareFilesUpload(files);
        }}
      >
        {children}
      </FilePicker>
      <FileList
        canDownload
        className="w-full"
        isPrivate={isPrivate}
        files={toJS(storeFiles)}
        deleteFileItem={deleteFileItem}
        onRetryFileUpload={retryUploadFile}
      />
    </div>
  );
}
export default observer(FileUploader);
