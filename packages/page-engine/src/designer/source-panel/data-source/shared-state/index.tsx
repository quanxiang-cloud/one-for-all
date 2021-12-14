import React, { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import cs from 'classnames';
import { observer } from 'mobx-react';
import Editor, { loader } from '@monaco-editor/react';

import { Search, Icon, Tooltip, Modal, toast } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';

import VarItem from './var-item';

import styles from '../index.m.scss';

interface Props {
  className?: string;
}

function SharedState(props: Props): JSX.Element {
  const { dataSource } = useCtx();
  const { modalOpen, setModalOpen, curSharedState } = dataSource;
  const { register, formState: { errors }, handleSubmit, getValues, trigger, clearErrors, setValue } = useForm();
  const editorRef = useRef<any>(null);

  function onSubmit(data: any): void {
    dataSource.saveSharedState(data.name, JSON.stringify(data));
  }

  function handleEditorMount(editor: any): void {
    editorRef.current = editor;
  }

  // @see https://github.com/suren-atoyan/monaco-react/issues/217
  useEffect(() => {
    loader.config({ paths: { vs: '/dist/monaco-editor/vs' } });
  }, []);

  const noData = !Object.keys(dataSource.sharedState).length;

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
              setModalOpen(true);
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
      {modalOpen && (
        <Modal
          title={curSharedState ? '修改变量参数' : '新建变量参数'}
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
                    const editorVal = editorRef.current?.getValue();
                    if (!editorVal) {
                      toast.error('请输入变量数据');
                      return;
                    }

                    // check editor val is valid js value
                    let finalVal;
                    try {
                      finalVal = JSON.parse(editorVal);
                      setValue('val', finalVal);
                    } catch (err: any) {
                      toast.error(`变量值不是合法的 JS 数据: ${err.message}`);
                      return;
                    }
                    onSubmit(getValues());
                  }
                });
              },
              text: '确认',
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
            }}>
            <div className='flex flex-col mb-24'>
              <p>参数名称</p>
              <input
                type="text"
                className={cs('input', styles.input, { [styles.error]: errors.name })}
                maxLength={20}
                defaultValue={curSharedState ? curSharedState.name : ''}
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
            <div className='flex flex-col mb-24'>
              <p>变量数据</p>
              <Editor
                height={200}
                defaultLanguage='javascript'
                theme='vs-dark'
                onMount={handleEditorMount}
                defaultValue={curSharedState ? JSON.stringify(curSharedState.val) : JSON.stringify({
                  key1: 'val1',
                  key2: 'val2',
                }, null, 2)}
              />
            </div>
            <div className='flex flex-col'>
              <p>描述</p>
              <textarea
                placeholder='选填（不超过100字符）'
                className={cs('textarea', styles.textarea)}
                defaultValue={curSharedState ? curSharedState.desc : ''}
                cols={20}
                rows={5}
                {...register('desc', {
                  shouldUnregister: true,
                })}
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default observer(SharedState);
