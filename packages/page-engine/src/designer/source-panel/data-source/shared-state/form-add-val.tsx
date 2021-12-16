import React, { useEffect, useRef } from 'react';
import cs from 'classnames';
import Editor from '@monaco-editor/react';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import { useCtx } from '@ofa/page-engine';
import { Modal, toast } from '@ofa/ui';

import styles from '../index.m.scss';

interface Props {
  className?: string;
}

function FormAddVal(props: Props): JSX.Element {
  const ctx = useCtx();
  const { dataSource, page } = ctx;
  const { formState: { errors }, setValue } = useForm();
  const { curSharedState, editorModalOpen, setEditorModalOpen, curSharedVal, setCurSharedVal } = dataSource;
  const editorRef = useRef<any>(null);

  useEffect(()=> {
    // set form initial vals
    if (!editorModalOpen) {
      dataSource.resetCurSharedVal();
    } else {
      // init cur shared val by chosen state key
      if (curSharedState) {
        setCurSharedVal(curSharedState);
        // sync with editor
        editorRef.current?.setValue(curSharedState.val);
      }
    }
  }, [editorModalOpen]);

  function handleEditorMount(editor: any): void {
    editorRef.current = editor;
  }

  function handleSaveSharedVal(): void {
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
    const formData = toJS(curSharedVal);
    if (validateName(formData.name)) {
      dataSource.saveSharedState(formData.name, JSON.stringify(formData), ()=> {
        // save whole page schema
        ctx.onSave(page.schema);
      });
    }
  }

  function validateName(val: string): boolean {
    if (!val) {
      toast.error('请填写变量名');
      return false;
    }
    if (!/^[a-zA-Z_]\w*$/.test(val)) {
      toast.error('非法的变量名');
      return false;
    }
    return true;
  }

  return (
    <Modal
      className={cs(styles.editorModal, { [styles.hide]: !editorModalOpen })}
      title={dataSource.curSharedStateKey ? '修改变量参数' : '新建变量参数'}
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
      <form className='px-40 py-24'>
        <div className='flex flex-col mb-24'>
          <p>参数名称</p>
          <input
            type="text"
            className={cs('input', styles.input, { [styles.error]: errors.name })}
            maxLength={20}
            value={curSharedVal.name}
            onBlur={(ev)=> validateName(ev.target.value)}
            onChange={(ev)=> {
              setCurSharedVal('name', ev.target.value || '');
            }}
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
            value={curSharedVal.val}
            onChange={(val)=> {
              setCurSharedVal('val', val);
            }}
          />
        </div>
        <div className='flex flex-col'>
          <p>描述</p>
          <textarea
            placeholder='选填（不超过100字符）'
            className={cs('textarea', styles.textarea)}
            value={curSharedVal.desc}
            onChange={(ev)=> {
              setCurSharedVal('desc', ev.target.value || '');
            }}
            cols={20}
            rows={5}
          />
        </div>
      </form>
    </Modal>
  );
}

export default observer(FormAddVal);
