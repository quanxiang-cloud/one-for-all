// API for upload and download
export const FILE_DELETE_API = '/api/v1/fileserver/del';
export const IMG_THUMBNAIL_API = '/api/v1/fileserver/thumbnail';
export const SMALL_FILE_SIGN_API = '/api/v1/fileserver/sign/upload';
export const FINISH_FILE_UPLOAD_API = '/api/v1/fileserver/sign/finish';
export const BIG_FILE_SIGN_API = '/api/v1/fileserver/sign/initMultipart';
export const FILE_DOWNLOAD_INFO_API = '/api/v1/fileserver/sign/download';
export const FILE_PART_SIGN_API = '/api/v1/fileserver/sign/uploadMultipart';
export const ABORT_MULTIPART_API = '/api/v1/fileserver/sign/abortMultipart';
export const GET_MULTIPART_LIST_API = '/api/v1/fileserver/sign/listMultipart';
export const COMPLETE_MULTIPART_API = '/api/v1/fileserver/sign/completeMultipart';

// File services path config
export const OSS_DOMAIN = 'fs.qxp.alpha:9000';
export const OSS_PRIVATE_BUCKET_NAME = 'qxp-storage';
export const OSS_PUBLIC_BUCKET_NAME = 'qxp-static';

// File chunk config
export const CHUNK_SIZE = 1024 * 1024 * 5;
export const PARALLEL_UPLOAD_SIZE = 3;
export const MAX_SMALL_FILE_SIZE = 1024 * 1024 * 20; // 20 MB

// File list icon config
export const FILE_LIST_ICON: Record<string, { name: string, size: number, className?: string, color?: "red" | "yellow" | "green" | "gray" | "blue" | "white" | "rose" | "pink" | "purple" | "orange" | "primary" | undefined }> = {
  failed: { name: 'error', size: 20, color: 'red' },
  retry: { name: 'refresh', size: 20, color: 'yellow' },
  success: { name: 'done', size: 20, color: 'green' },
  download: { name: 'download', size: 20 },
  delete: { name: 'restore_from_trash', size: 20 },
  uploading: { name: 'loading', size: 20, className: 'animate-spin', color: 'blue' },
  processing: { name: 'hourglass_empty', size: 20, className: 'animate-spin', color: 'gray' },
  img: { name: 'insert_photo', size: 20, className: 'file-list-icon img-type' },
  file: { name: 'insert_drive_file', size: 20, className: 'file-list-icon file-type' },
};

// Default img types
export const DEFAULT_IMG_TYPES: string[] = [
  'image/gif',
  'image/tiff',
  'image/png',
  'image/bmp',
  'image/jpeg',
];

export const THUMBNAIL_SIZE = 64;
