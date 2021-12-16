import React from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import { Icon } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';

import styles from '../index.m.scss';

interface Props {
  className?: string;
  name: string;
  spec: any; // api spec
}

function VarItem({ className, name, spec }: Props): JSX.Element {
  const { dataSource } = useCtx();

  function handleDelete(): void {
    dataSource.removeApiState(name);
  }

  return (
    <div className={cs('px-8 py-4', styles.varItem, className)}>
      <div className={cs('flex justify-between', styles.bar)}>
        <div className='flex-1 font-medium'>
          <span>{name}</span>
        </div>
        <div className={styles.varActions}>
          <Icon name='delete' clickable onClick={handleDelete} />
        </div>
      </div>
      <div className={styles.apiVarCont}>
        <div className='flex items-center mb-8 mt-8'>
          <span>API 数据源:</span>
          <span className='flex-wrap ml-6'>{spec.title || name}</span>
        </div>
      </div>
    </div>
  );
}

export default observer(VarItem);
