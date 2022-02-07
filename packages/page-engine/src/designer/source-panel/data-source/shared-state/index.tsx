import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { pickBy } from 'lodash';
import { useUpdateEffect, useDebounce } from 'react-use';

import { Search, Icon, Tooltip } from '@one-for-all/ui';
import { useCtx } from '../../../../index';

import VarItem from './var-item';
import FormAddVal from './form-add-val';

import styles from '../index.m.scss';

function SharedState(): JSX.Element {
  const { dataSource } = useCtx();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [curStates, setCurStates] = useState(dataSource.sharedState);

  useDebounce(()=> {
    setDebouncedSearch(search);
  }, 500, [search]);

  useUpdateEffect(()=> {
    setCurStates(pickBy(dataSource.sharedState, (_, key)=> key.toLowerCase().includes(debouncedSearch.toLowerCase())));
  }, [debouncedSearch]);

  const noData = !Object.keys(curStates).length;

  return (
    <div>
      <Search
        className={styles.search}
        value={search}
        onChange={setSearch}
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
            {Object.entries(curStates).map(([name, conf]: [string, any]) => {
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
