import React from 'react';
import cs from 'classnames';

import { Icon, toast } from '@one-for-all/ui';
import { httpClient } from '../utils';

import FileIcon from './file-icon';
import { ImgList } from './img-list';
import { FILE_LIST_ICON, FILE_DOWNLOAD_INFO_API, OSS_PRIVATE_BUCKET_NAME, OSS_PUBLIC_BUCKET_NAME, OSS_DOMAIN } from '../constants';

interface FileListProps {
  files: QXPUploadFileTask[];
  imgOnly?: boolean;
  className?: string;
  canDownload?: boolean;
  isPrivate?: boolean;
  style?: React.CSSProperties;
  showFileName?: boolean;
  deleteFileItem?: (file: QXPUploadFileTask) => void;
  onRetryFileUpload?: (file: QXPUploadFileTask) => void;
}

export default function FileList({
  files,
  style,
  imgOnly,
  className,
  isPrivate = true,
  canDownload = true,
  showFileName = true,
  deleteFileItem,
  onRetryFileUpload,
}: FileListProps): JSX.Element | null {  
  function handleSingleFileDownload(file: QXPUploadFileTask): void {
    if (!canDownload) return;

    if (file.state === 'success' || !file.state) {
      const { uid } = file;

      if (!OSS_PUBLIC_BUCKET_NAME || !OSS_PRIVATE_BUCKET_NAME || !OSS_DOMAIN) {
        toast.error('QXP Uploader : Bucket or domain is not provided for file signature');
        return;
      }

      if (!isPrivate) {
        window.open(`${window.location.protocol}//${OSS_PUBLIC_BUCKET_NAME}.${OSS_DOMAIN}/${uid}`, '_blank');
        return;
      }

      httpClient<{ url: string }>(FILE_DOWNLOAD_INFO_API, {
        path: `${OSS_PRIVATE_BUCKET_NAME}/${uid}`,
        fileName: file.name,
      })
        .then(({ url }) => {
          if (!url) throw Error('无法下载该文件');
          window.open(url, '_self');
        }).catch(toast.error);
    }
  }

  function fileUploadProgressRender(file: QXPUploadFileTask): React.ReactNode {
    const { progress, state } = file;
    if (!state) return;

    if ('success failed'.indexOf(state) === -1 && progress) return progress + '%';

    if (state === 'failed') {
      return (<Icon {...FILE_LIST_ICON.retry} clickable onClick={() => onRetryFileUpload?.(file)} />);
    }
    return;
  }

  if (!files.length) return null;

  if (imgOnly) {
    return (
      <ImgList
        files={files}
        style={style}
        fileBucket={isPrivate ? OSS_PRIVATE_BUCKET_NAME : OSS_PUBLIC_BUCKET_NAME}
        className={className}
        deleteFileItem={deleteFileItem}
        handleDownload={handleSingleFileDownload}
        uploadProgressRender={fileUploadProgressRender}
      />
    );
  }

  return (
    <>
      {files.map((file) => {
        const { uid, name, state } = file;
        return (
          <div
            key={uid}
            style={style}
            className={cs(
              'grid grid-cols-3 w-full relative justify-between items-center rounded-8 p-2',
              'flex-shrink-0 hover:bg-blue-100 group qxp-file-item', className,
            )}
          >
            <div
              title={name}
              className={cs('flex items-center overflow-hidden col-start-1 col-end-3',
                { 'cursor-pointer': canDownload },
              )}
              onClick={() => handleSingleFileDownload(file)}
            >
              <FileIcon file={file} size={30} />
              {showFileName && (
                <span className="block overflow-hidden overflow-ellipsis whitespace-nowrap text-12">
                  {name}
                </span>
              )}
            </div>
            <div className='flex justify-end items-center text-12 gap-x-5 pr-5 flex-shrink-0 file-opt'>
              {
                deleteFileItem &&
                (<span className='text-center order-last transition-opacity ease-linear opacity-0 group-hover:opacity-100 file-delete-btn'>
                  <Icon
                    {...FILE_LIST_ICON.delete}
                    clickable
                    className="text-gray-600"
                    onClick={() => {
                      if (file.state === 'processing' && file.progress === 100) return;
                      deleteFileItem?.(file);
                    }}
                  />
                </span>)
              }
              <span className="text-12 inline-block file-percent">
                {fileUploadProgressRender(file)}
              </span>
              <span>
                {state && (<Icon {...FILE_LIST_ICON[state]} />)}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
}
