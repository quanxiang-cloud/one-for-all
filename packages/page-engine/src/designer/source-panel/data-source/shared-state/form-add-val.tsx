import React, { useRef } from 'react';
import cs from 'classnames';
import Editor from '@monaco-editor/react';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react';

import { useCtx } from '@ofa/page-engine';
import { Modal, toast } from '@ofa/ui';

import styles from '../index.m.scss';

interface Props {
  className?: string;
}

function FormAddVal(props: Props): JSX.Element {
  const { handleSubmit, trigger, clearErrors, register, formState: { errors }, setValue, getValues } = useForm();
  const { dataSource } = useCtx();
  const { curSharedState, editorModalOpen, setEditorModalOpen } = dataSource;
  const editorRef = useRef<any>(null);

  function onSubmit(data: any): void {
    dataSource.saveSharedState(data.name, JSON.stringify(data));
  }

  function handleEditorMount(editor: any): void {
    editorRef.current = editor;
  }

  function handleSaveSharedVal(): void {
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
  }

  return (
    <Modal
      className={cs(styles.editorModal, { [styles.hide]: !editorModalOpen })}
      title={curSharedState ? '修改变量参数' : '新建变量参数'}
      onClose={() => setEditorModalOpen(false)}
      footerBtns={[
        {
          key: 'close',
          iconName: 'close',
          onClick: () => setEditorModalOpen(false),
          text: '取消',
        },
        {
          key: 'check',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleSaveSharedVal,
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
            language='javascript'
            theme='vs-dark'
            onMount={handleEditorMount}
            defaultValue={JSON.stringify(
              curSharedState ? curSharedState.val : {
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
  );
}

export default observer(FormAddVal);
