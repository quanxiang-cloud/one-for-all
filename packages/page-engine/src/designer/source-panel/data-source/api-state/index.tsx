import React from 'react';
import { useForm } from 'react-hook-form';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import { Search, Icon, Tooltip, Modal, toast } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';

import VarItem from './var-item';

import styles from '../index.m.scss';

interface Props {
  className?: string;
}

function ApiState(props: Props): JSX.Element {
  const ctx = useCtx();
  const { dataSource } = ctx;
  const { modalOpen, setModalOpen, curApiState, apiSpec } = dataSource;
  const { register, formState: { errors }, handleSubmit, getValues, trigger, clearErrors } = useForm();

  function onSubmit(data: any): void {
    console.log('save api state: ', data, toJS(apiSpec));
    dataSource.saveApiState(data.name, toJS(apiSpec));
  }

  const noData = !Object.keys(dataSource.apiState).length;

  return (
    <div>
      <Search
        className={styles.search}
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
            <p>可以选择将该应用的内部API和第三方API数据加入后使用哦！</p>
          </div>
        )}
        {!noData && (
          <div className='flex flex-col h-full'>
            {Object.entries(dataSource.apiState).map(([name, spec]: [string, any]) => {
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
                <p className='text-12 text-gray-600'>参数名称</p>
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
                      if (!/^[a-zA-Z_]\w*$/.test(val)) {
                        toast.error('非法的变量名');
                        return false;
                      }
                      return true;
                    },
                  })}
                />
                <p className='text-12 text-gray-600'>不超过 20 字符，必须以字母开头，只能包含字母、数字、下划线，名称不可重复。</p>
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
