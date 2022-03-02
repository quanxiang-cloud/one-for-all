import React, { useState, ForwardedRef, forwardRef } from 'react';

import { FileUploaderConfigProps } from './config-form';
import QXPFileUploader from './qxp-file-uploader'

export interface Props extends FileUploaderConfigProps {
  className?: string;
  style?: React.CSSProperties;
  "data-node-key"?: string;
  onChange?: (uploadedFileList: QXPUploadFileBaseProps[]) => void;
}

function FileUploader(props: Props, ref?: ForwardedRef<HTMLDivElement>): JSX.Element {
  const {
    name,
    disabled,
    multiple,
    className,
    acceptTypes,
    filesLimit,
    maxFileSize,
    style,
    onChange,
    description,
    iconName,
  } = props
  const dataNodeKey = props['data-node-key'] || '';

  const [uploadedFiles, setUploadedFiles] = useState<QXPUploadFileBaseProps[]>([]);

  function onFileUploadSuccess(file: QXPUploadFileBaseProps): void {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, file]
      onChange?.(updatedFiles);
      return updatedFiles;
    })
  }

  function onUpdatedFileRemove(delFile: QXPUploadFileBaseProps): void {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => delFile.uid !== file.uid)
      onChange?.(updatedFiles);
      return updatedFiles;
    })
  }

  return (
    <div
      ref={ref}
      data-node-key={dataNodeKey}
    >
      <QXPFileUploader
        name={name}
        style={style}
        limit={filesLimit}
        iconName={iconName}
        disabled={disabled}
        multiple={multiple}
        accept={acceptTypes}
        className={className}
        fileData={uploadedFiles}
        maxFileSize={maxFileSize}
        uploaderDescription={description}
        onFileSuccess={onFileUploadSuccess}
        onFileDelete={onUpdatedFileRemove}
      />
    </div>
  );
}

export default forwardRef(FileUploader);
