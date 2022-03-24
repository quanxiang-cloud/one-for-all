import React, { ForwardedRef, PropsWithChildren } from 'react';
import cs from 'classnames';

import Icon from '@one-for-all/icon';
import { unitToPx } from '../../utils';

import './loading.scss';

function Loading(
  { desc, className, iconSize = 24, vertical }: PropsWithChildren<LoadingProps>,
  ref?: ForwardedRef<HTMLDivElement>,
): JSX.Element {
  return (
    <div className={cs('ofa-loading', className, { 'ofa-loading--vertical': vertical })} ref={ref}>
      <Icon name="refresh" size={unitToPx(iconSize ?? 0)} className="ofa-loading__icon" />
      {!!desc && <span className="ofa-loading__desc">{desc}</span>}
    </div>
  );
}

export default React.forwardRef<HTMLDivElement, LoadingProps>(Loading);
