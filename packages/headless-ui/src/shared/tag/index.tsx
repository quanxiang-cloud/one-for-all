import React, { Ref, forwardRef, ForwardedRef } from 'react';
import cs from 'classnames';

import Icon from '@one-for-all/icon';

function Tag<T extends React.Key>(props: TagProps<T>, ref?: ForwardedRef<HTMLSpanElement>): JSX.Element {
  const { value, label = '', onDelete, deleteIconSize = 12, modifier, className, style } = props;

  return (
    <span
      ref={ref}
      style={style}
      className={cs('ofa-tag', className, { [`ofa-tag--${modifier}`]: modifier })}
    >
      {label}
      {onDelete && (
        <span className="ofa-tag-delete-icon" onClick={(): void => onDelete(value)}>
          <Icon name="close" size={deleteIconSize} />
        </span>
      )}
    </span>
  );
}

export default forwardRef(Tag);
