import React, { useMemo, useState } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import { Icon, Tooltip } from '@ofa/ui';
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
    setCurSharedStateKey('');
    const countName = Object.keys(dataSource.sharedState).filter((n) => n === name || n.startsWith(`${name}_copy`)).length;
    const newName = countName === 1 ? `${name}_copy` : `${name}_copy${countName}`;
    const newConf = JSON.parse(conf);
    Object.assign(newConf, { name: newName });
    dataSource.saveSharedState(newName, JSON.stringify(newConf));
  }

  function handleEdit(): void {
    setCurSharedStateKey(name);
    setModalOpen(true);
  }

  function handleDelete(): void {
    dataSource.removeSharedState(name);
  }

  return (
    <div className={cs('px-8 py-4', styles.varItem, { [styles.expand]: expand }, className)}>
      <div className={cs('flex justify-between', styles.bar)}>
        <div className={styles.varName}>
          <span>{name}</span>
        </div>
        <div className={styles.varActions}>
          <Tooltip position='top' label='复制'>
            <Icon name='content_copy' clickable onClick={handleCopy} />
          </Tooltip>
          <Tooltip position='top' label='修改'>
            <Icon name='edit' clickable onClick={handleEdit} />
          </Tooltip>
          <Tooltip position='top' label='删除'>
            <Icon name='delete' clickable onClick={handleDelete} />
          </Tooltip>
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

export default observer(VarItem);
