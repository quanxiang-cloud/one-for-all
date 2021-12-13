import React, { useMemo, useState } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import { Icon } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';

import styles from '../index.m.scss';

interface Props {
  className?: string;
  name: string;
  conf: string; // json string value
}

type VarContent = {
  name: string;
  val: any;
  desc: string;
}

function VarItem({ className, name, conf }: Props): JSX.Element {
  const { dataSource } = useCtx();
  const { setCurSharedStateKey, setModalOpen } = dataSource;
  const data: VarContent = useMemo(() => JSON.parse(conf), [conf]);
  const [expand, setExpand] = useState(false);

  function handleCopy(): void {

  }

  function handleEdit(): void {
    setCurSharedStateKey(name);
    setModalOpen(true);
  }

  function handleDelete(): void {
    dataSource.saveSharedState(name, null, true);
  }

  return (
    <div className={cs('px-8 py-4', styles.varItem, { [styles.expand]: expand }, className)}>
      <div className={cs('flex justify-between')}>
        <div className={styles.varName}>
          <span>{name}</span>
        </div>
        <div className={styles.varActions}>
          <Icon name='content_copy' clickable onClick={handleCopy} />
          <Icon name='edit' clickable onClick={handleEdit} />
          <Icon name='delete' clickable onClick={handleDelete} />
          <Icon name={expand ? 'expand_less' : 'expand_more'} clickable onClick={() => setExpand((exp) => !exp)} />
        </div>
      </div>
      <div className={styles.varCont}>
        <div className='flex items-center mb-8 mt-8'>
          <span>初始值:</span>
          <span className='flex-wrap ml-6'>{JSON.stringify(data.val)}</span>
        </div>
        <div className='flex items-center'>
          <span>描述:</span>
          <span className='flex-wrap ml-6'>{data.desc}</span>
        </div>
      </div>
    </div>
  );
}

export default VarItem;
