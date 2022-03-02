import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import cs from 'classnames';

import { Icon } from '@one-for-all/ui';

interface FilePickerProps {
  name?: string;
  accept?: string;
  iconName?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onSelectFiles?: (files: File[]) => void;
}

function FilePicker({
  style,
  accept,
  children,
  className,
  description,
  multiple = false,
  disabled = false,
  name = 'qxp-file-picker',
  iconName = 'backup',
  onSelectFiles,
}: FilePickerProps): JSX.Element {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onFileInputChange(e: ChangeEvent<HTMLInputElement>): void {
    const { files } = e.target;
    if (files) {
      onSelectFiles?.(Array.from(files));
    }
    (fileInputRef?.current as HTMLInputElement).value = '';
  }

  // File drag event handler
  function onFileDrop(e: DragEvent): void {
    e.preventDefault();
    setIsDragging(false);
    const { files } = e.dataTransfer;
    onSelectFiles?.(Array.from(files));
    (fileInputRef?.current as HTMLInputElement).value = '';
  }

  function handlePickerClick(): void {
    fileInputRef.current?.click();
  }

  const events = disabled ?
    {} :
    {
      onDrop: onFileDrop,
      onDragOver: (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
      },
      onDragLeave: (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
      },
    };

  return (
    <div
      {...events}
      style={style}
      role="button"
      onClick={handlePickerClick}
      className={cs(
        'qxp-file-picker border-1 border-dashed border-gray-300 rounded-8 flex-shrink-0',
        'flex justify-center items-center flex-col bg-transparent text-gray-600 cursor-pointer',
        className, {
        'opacity-50': disabled,
        'qxp-file-picker-dragover border-blue-600': isDragging,
        'cursor-not-allowed': disabled,
      })}
    >
      <input
        type="file"
        name={name}
        ref={fileInputRef}
        multiple={multiple}
        disabled={disabled}
        accept={accept?.toString()}
        onChange={onFileInputChange}
        style={{ display: 'none' }}
      />
      {children || (
        <div className={cs('flex flex-col justify-center items-center')}>
          <Icon className="upload-icon text-gray-600 flex-shrink-0" name={iconName} size={24} />
          <div className="text-12 text-center select-none">{description || '点击或拖拽上传文件'}</div>
        </div>
      )}
    </div>
  );
}

export default FilePicker;
