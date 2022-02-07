import React, { useState } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import { Icon } from '@one-for-all/ui';
import { useCtx } from '../../../../index';

import styles from '../index.m.scss';

interface Props {
  className?: string;
  name: string;
  spec: any; // api spec
}

function VarItem({ className, name, spec }: Props): JSX.Element {
  const ctx = useCtx();
  const { dataSource, page } = ctx;
  const [expand, setExpand] = useState(true);
  const [method, apiPath] = String(spec).split(':');

  function handleDelete(ev: React.MouseEvent<SVGElement>): void {
    ev.stopPropagation();
    dataSource.removeApiState(name, ()=> ctx.onSave(page.schema, { silent: true }));
  }

  // function handleEdit(ev: React.MouseEvent<SVGElement>): void {
  //   ev.stopPropagation();
  //   dataSource.setCurApiId(spec);
  //   dataSource.curApiStateKey = name;
  //   dataSource.setModalOpen(true);
  // }

  function handleExpand(ev: React.MouseEvent<SVGElement>): void {
    ev.stopPropagation();
    setExpand((exp) => !exp);
  }

  return (
    <div className={cs('px-8 py-4', styles.varItem, { [styles.expand]: expand }, className)}>
      <div
        className={cs('flex justify-between cursor-pointer', styles.bar)}
        onClick={() => setExpand((exp) => !exp)}
      >
        <div className={cs('flex-1 font-medium', styles.varName)}>
          <span>{name}</span>
        </div>
        <div className={styles.varActions}>
          {/* <Icon name='edit' clickable onClick={handleEdit} />*/}
          <Icon name='delete' clickable onClick={handleDelete} />
          <Icon name={expand ? 'expand_less' : 'expand_more'} clickable onClick={handleExpand}/>
        </div>
      </div>
      <div className={styles.varCont}>
        <div className='flex items-center mb-8 mt-8'>
          <span>路径:</span>
          <span className='flex-wrap break-all flex-1 ml-6'>{apiPath}</span>
        </div>
        <div className='flex items-center mb-8'>
          <span>请求方法:</span>
          <span className='flex-wrap break-all flex-1 ml-6'>{method.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}

export default observer(VarItem);
