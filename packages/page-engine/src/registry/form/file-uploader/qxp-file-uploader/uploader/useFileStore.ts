import { useMemo } from 'react';
import FileStore from './store';
import type { FileStoreProps } from './store';

export default function useFileStore( props: FileStoreProps): FileStore {
  return useMemo( () => new FileStore(props), []);
}
