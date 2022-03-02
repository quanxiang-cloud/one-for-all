interface QXPFilePartBlob {
  chunkBlob: Blob;
  partNumber: number;
}

interface QXPUploadFileBaseProps {
  uid: string;
  type: string;
  name: string;
  size: number;
}

interface QXPUploadFileTask extends QXPUploadFileBaseProps {
  uploadID?: string;
  progress?: number;
  state?: 'uploading' | 'processing' | 'success' | 'failed';
  blob?: File;
  md5?: string;
  uploadUrl?: string;
  md5Worker?: Worker | null;
  fileChunks?: QXPFilePartBlob[] | null;
}

interface Window {
  CONFIG: { [key: string]: any; }
}