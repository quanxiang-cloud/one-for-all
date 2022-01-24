import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { pickBy } from 'lodash';
import { useUpdateEffect, useDebounce } from 'react-use';

import { Search, Icon, Tooltip, Modal, toast } from '@one-for-all/ui';
import { useCtx } from '../../../../index';

import VarItem from './var-item';

import styles from '../index.m.scss';

interface Props {
  className?: string;
}

function ApiState(props: Props): JSX.Element {
  const ctx = useCtx();
  const { dataSource, page } = ctx;
  const { modalOpen, setModalOpen, curApiState, curApiId } = dataSource;
  const { register, formState: { errors }, handleSubmit, getValues, trigger, clearErrors } = useForm();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [curStates, setCurStates] = useState(dataSource.apiState);

  useEffect(()=> {
    if (!dataSource.modalOpen) {
      dataSource.setCurApiId('');
    }
  }, [dataSource.modalOpen]);

  useDebounce(()=> {
    setDebouncedSearch(search);
  }, 500, [search]);

  useUpdateEffect(()=> {
    setCurStates(pickBy(dataSource.apiState, (_, key)=> key.toLowerCase().includes(debouncedSearch.toLowerCase())));
  }, [debouncedSearch]);

  function onSubmit(data: any): void {
    // console.log('save api state: ', data, curApiId);
    if (!curApiId) {
      toast.error('请选择一个平台 API');
      return;
    }
    dataSource.saveApiState(data.name, curApiId, ()=> ctx.onSave(page.schema, { silent: true }));
  }

  const noData = !Object.keys(curStates).length;

  return (
    <div>
      <Search
        className={styles.search}
        value={search}
        onChange={setSearch}
        placeholder='搜索 API 名称..'
        // @ts-ignore
        actions={(
          <Tooltip position='top' label='选中平台 API'>
            <Icon name='add' clickable onClick={() => {
              setModalOpen(true);
            }} />
          </Tooltip>
        )}
      />
      <div className='relative'>
        {noData && (
          <div
            className='flex justify-center items-center h-full flex-col text-center px-40 text-gray-400'
            style={{ marginTop: '72px' }}
          >
            <p>暂无数据</p>
            {!Object.keys(dataSource.apiState).length && <p>可以选择将该应用的内部API和第三方API数据加入后使用哦！</p>}
          </div>
        )}
        {!noData && (
          <div className='flex flex-col h-full'>
            {Object.entries(curStates).map(([name, spec]: [string, any]) => {
              return (
                <VarItem key={name} name={name} spec={spec} />
              );
            })}
          </div>
        )}
      </div>
      {modalOpen && (
        <Modal
          title='选择平台 API'
          width={1234}
          onClose={() => setModalOpen(false)}
          footerBtns={[
            {
              key: 'close',
              iconName: 'close',
              onClick: () => setModalOpen(false),
              text: '取消',
            },
            {
              key: 'check',
              iconName: 'check',
              modifier: 'primary',
              onClick: () => {
                trigger().then((valid) => {
                  if (valid) {
                    onSubmit(getValues());
                  }
                });
              },
              text: '确定导入',
            },
          ]}
        >
          <form
            className='px-40 py-24'
            onSubmit={handleSubmit(onSubmit)}
            onChange={() => {
              trigger().then((valid) => {
                if (valid) {
                  clearErrors();
                }
              });
            }}
          >
            <div className='flex justify-between items-center'>
              <div className='flex flex-col mb-24'>
                <p className='text-12 text-gray-600'>API变量名称</p>
                <input
                  type="text"
                  className={cs('input', styles.input, { [styles.error]: errors.name })}
                  maxLength={20}
                  defaultValue={curApiState ? curApiState.name : ''}
                  {...register('name', {
                    shouldUnregister: true,
                    validate: (val) => {
                      if (!val) {
                        toast.error('请填写变量名');
                        return false;
                      }
                      if (!/^[\u4e00-\u9fa5_a-zA-Z0-9\-\s]+$/.test(val)) {
                        toast.error('非法的变量名');
                        return false;
                      }
                      return true;
                    },
                  })}
                />
                <p className='text-12 text-gray-600'>不超过 20 字符，支持字母、数字、下划线、中文，名称不可重复。</p>
              </div>
              {ctx.designer.vdoms.platformApis}
            </div>
            <div className={cs('flex flex-col justify-center items-center', styles.apiState)}>
              {ctx.designer.vdoms.apiStateDetail}
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default observer(ApiState);
