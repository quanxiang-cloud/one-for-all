import { useMemo } from 'react';
import { IdType } from 'react-table';

import checkboxColumn from './checkbox-column';

export const DEFAULT_WIDTH = 150;

export const MINIMUM_WIDTH = 50;

export const getDefaultSelectMap = (keys: string[] | undefined): Record<IdType<any>, boolean> => {
  if (!keys) {
    return {};
  }

  const keyMap: any = {};
  keys.forEach((key) => {
    keyMap[key] = true;
  });
  return keyMap;
};

export function useExtendColumns<T extends Record<string, unknown>>(
  originalColumns: UnionColumn<T>[],
  showCheckbox?: boolean,
): UnionColumn<T>[] {
  return useMemo(() => {
    const _originalColumns = originalColumns.map((col) => {
      if (col.width) {
        return col;
      }

      return { ...col, width: DEFAULT_WIDTH };
    });

    if (!showCheckbox) {
      return _originalColumns;
    }

    const firstColumnFixed = _originalColumns.length > 0 && (_originalColumns[0] as FixedColumn<any>).fixed;
    return [
      { ...checkboxColumn, fixed: firstColumnFixed },
      ..._originalColumns,
    ];
  }, [showCheckbox, originalColumns]);
}
