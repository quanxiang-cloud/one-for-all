import React from 'react';
import cs from 'classnames';

import { Icon, Tooltip } from '@ofa/ui';

import styles from './index.m.scss';

interface Props {
  title: string;
  bound: boolean;
  onEdit: ()=> void;
  onBind: ()=> void;
  onUnbind: ()=> void;
  className?: string;
}

function BindItem({ title, bound, onBind, onEdit, onUnbind }: Props): JSX.Element {
  if (bound) {
    return (
      <div className='inline-flex items-center w-full'>
        <span className='border border-gray-100 flex-1 w-100 mr-8 px-8 py-4'>已绑定</span>
        <Tooltip position='top' label='编辑绑定'>
          <Icon
            name='code'
            className='mr-16'
            clickable
            onClick={onEdit}
          />
        </Tooltip>
        <Tooltip position='top' label='解绑'>
          <Icon name='link' clickable onClick={onUnbind} />
        </Tooltip>
      </div>
    );
  }

  return (
    <div className={cs('px-8 py-4', styles.btnAdd)} onClick={onBind}>
      <Icon name='add' />
      <span>{title}</span>
    </div>
  );
}

export default BindItem;
