import React, { ForwardedRef, PropsWithChildren } from 'react';
import cs from 'classnames';

import Icon from '@one-for-all/icon';
import { unitToPx } from '../../utils';

import '../../styles_todo_delete_this/components/loading.scss';

function Loading(
  { desc, className, iconSize, children, vertical }: PropsWithChildren<LoadingProps>,
  ref?: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  return (
    <div
      className={cs(
        'ofa-loading',
        className,
        { 'ofa-loading--vertical': vertical },
      )}
      ref={ref}
    >
      <Icon name='refresh' size={unitToPx(iconSize ?? 0)} className='ofa-loading__icon' />
      {!!desc && <span className='ofa-loading__desc'>desc</span>}
      {!desc && !!children && <span className='ofa-loading__desc'>children</span>}
    </div>
  );
}

export default React.forwardRef<HTMLDivElement, LoadingProps>(Loading);
