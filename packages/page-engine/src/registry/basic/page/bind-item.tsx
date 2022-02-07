import React from 'react';

import { Icon, Tooltip } from '@one-for-all/ui';

import styles from './index.m.scss';

interface Props {
  bound: boolean;
  onEdit: ()=> void;
  onBind: ()=> void;
  onUnbind: ()=> void;
  className?: string;
}

function BindItem({ bound, onBind, onEdit, onUnbind }: Props): JSX.Element {
  if (bound) {
    return (
      <div className='inline-flex items-center w-full'>
        <span className='border border-gray-100 flex-1 w-100 mr-8 px-8 py-4'>已绑定</span>
        <Tooltip position='top' label='编辑绑定函数'>
          <Icon
            name='code'
            className='mr-16'
            clickable
            onClick={onEdit}
          />
        </Tooltip>
        <Tooltip position='top' label='解绑函数'>
          <Icon name='link' clickable onClick={onUnbind} />
        </Tooltip>
      </div>
    );
  }

  return (
    <div className={styles.btnAdd} onClick={onBind}>
      <Icon name='add' />
      <span>绑定动作</span>
    </div>
  );
}

export default BindItem;
