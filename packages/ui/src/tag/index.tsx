import React, { CSSProperties } from 'react';
import cs from 'classnames';

import Icon from '../icon';

type Props<T> = {
  value: React.ReactNode;
  id?: T;
  className?: string;
  onDelete?: (id: T, e: React.MouseEvent) => void;
  style?: CSSProperties;
  deleteIconSize?: number;
}

export default function Tag<T>({
  value,
  id,
  className,
  style,
  onDelete,
  deleteIconSize,
}: Props<T>): JSX.Element {
  return (
    <span className={cs('tag inline-flex items-center', className)} style={style}>
      {value}
      {
        onDelete && (
          <span className="ml-4 flex items-center" onClick={(e): void => id && onDelete(id, e)}>
            <Icon
              changeable
              clickable
              name="close"
              size={deleteIconSize || 12}
            />
          </span>
        )
      }
    </span>
  );
}
