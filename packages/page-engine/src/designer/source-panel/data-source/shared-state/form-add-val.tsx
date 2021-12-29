import React, { useEffect, useRef } from 'react';
import cs from 'classnames';
import Editor from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import { useCtx } from '@ofa/page-engine';
import { Modal, toast } from '@ofa/ui';

import styles from '../index.m.scss';

interface Props {
  className?: string;
}

function FormAddVal(props: Props): JSX.Element | null {
  const ctx = useCtx();
  const { dataSource, page } = ctx;
  const { formState: { errors } } = useForm();
  const { curSharedState, modalOpen, setModalOpen, curSharedVal, setCurSharedVal } = dataSource;

  useEffect(()=> {
    // set form initial vals
    if (!modalOpen) {
      dataSource.resetCurSharedVal();
    } else {
      // init cur shared val by chosen state key
      if (curSharedState) {
        setCurSharedVal(curSharedState);
      }
    }
  }, [modalOpen]);

  function handleSaveSharedVal(): void {
    // check editor val is valid js value
    try {
      JSON.parse(curSharedVal.val);
    } catch (err: any) {
      toast.error(`变量值不是合法的 JS 数据: ${err.message}`);
      return;
    }
    const formData = toJS(curSharedVal);
    if (validateName(formData.name)) {
      dataSource.saveSharedState(formData.name, JSON.stringify(formData), ()=> {
        // save whole page schema
        ctx.onSave(page.schema, { silent: true });
      });
    }
  }

  function validateName(val: string): boolean {
    if (!val) {
      toast.error('请填写变量名');
      return false;
    }
    if (!/^[\u4e00-\u9fa5_a-zA-Z0-9\-\s]+$/.test(val)) {
      toast.error('非法的变量名');
      return false;
    }
    return true;
  }

  if (!modalOpen) {
    return null;
  }

  return (
    <Modal
      className={styles.editorModal}
      title={dataSource.curSharedStateKey ? '修改变量参数' : '新建变量参数'}
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
            // onBlur={(ev)=> validateName(ev.target.value)}
            onChange={(ev)=> {
              setCurSharedVal('name', ev.target.value || '');
            }}
          />
          <p className='text-12 text-gray-600'>不超过 20 字符，支持字母、数字、下划线、中文，名称不可重复。</p>
        </div>
        <div className='flex flex-col mb-24'>
          <p>变量数据</p>
          <Editor
            value={curSharedVal.val}
            height="200px"
            // theme='dark'
            extensions={[javascript()]}
            onChange={(val) => {
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
            rows={3}
          />
        </div>
      </form>
    </Modal>
  );
}

export default observer(FormAddVal);
