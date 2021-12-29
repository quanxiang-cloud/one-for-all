import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import { Search, Icon, Tooltip } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';

import VarItem from './var-item';
import FormAddVal from './form-add-val';

import styles from '../index.m.scss';

interface Props {
  className?: string;
}

function SharedState(props: Props): JSX.Element {
  const { dataSource } = useCtx();
  const noData = !Object.keys(dataSource.sharedState).length;

  useEffect(()=> {
    dataSource.sharedState = dataSource.mapSharedStateSpec();
  }, []);

  return (
    <div>
      <Search
        className={styles.search}
        placeholder='搜索参数名称..'
        // @ts-ignore
        actions={(
          <Tooltip position='top' label='新建变量参数'>
            <Icon name='add' clickable onClick={() => {
              dataSource.setCurSharedStateKey('');
              dataSource.setModalOpen(true);
            }} />
          </Tooltip>
        )}
      />
      <div className='relative'>
        {noData && (
          <div className='flex justify-center items-center h-full text-gray-400' style={{ marginTop: '72px' }}>
            暂无数据
          </div>
        )}
        {!noData && (
          <div className='flex flex-col h-full'>
            {Object.entries(dataSource.sharedState).map(([name, conf]: [string, any]) => {
              return (
                <VarItem key={name} name={name} conf={conf} />
              );
            })}
          </div>
        )}
      </div>
      <FormAddVal />
    </div>
  );
}

export default observer(SharedState);
