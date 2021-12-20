import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import Editor from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { get } from 'lodash';

import { Modal, Icon, toast } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';

import styles from './index.m.scss';

interface Props {
  onClose: (open: boolean)=> void;
  className?: string;
}

function ModalBindFor({ onClose }: Props): JSX.Element | null {
  const { designer, dataSource, page } = useCtx();
  const [selected, setSelected] = useState<{name: string, conf: string} | null>(null);
  const [stateExpr, setStateExpr] = useState(''); // 绑定变量的表达式

  useEffect(()=> {
    setStateExpr(get(page.activeElem, '_renderer.for'));
  }, []);

  function handleBind(): void {
    if (!stateExpr) {
      toast.error('变量表达式不能为空');
      return;
    }
    page.updateElemProperty(page.activeElem.id, '_renderer.for', stateExpr);
    onClose(false);
  }

  return (
    <Modal
      title='添加 for 循环'
      onClose={()=> onClose(false)}
      footerBtns={[
        {
          key: 'close',
          iconName: 'close',
          onClick: () => onClose(false),
          text: '取消',
        },
        {
          key: 'check',
          iconName: 'check',
          modifier: 'primary',
          onClick: handleBind,
          text: '确定',
        },
      ]}
    >
      <div className={styles.modal}>
        <div className={styles.side}>
          {Object.entries(dataSource.sharedState).map(([name, conf])=> {
            return (
              <div
                key={name}
                className={cs('flex justify-between items-center cursor-pointer px-16 py-4 hover:bg-gray-200', {
                  [styles.active]: selected?.name === name,
                })}
                onClick={()=> {
                  setSelected({ name, conf });
                  setStateExpr(`sharedState['${name}']`);
                }}
              >
                <span className='flex-1 flex flex-wrap items-center'>
                  {name}
                  <span className='ml-8 border border-gray-100 text-12 text-gray-400'>普通变量</span>
                </span>
                {selected?.name === name && <Icon name='check' />}
              </div>
            );
          })}
          {Object.entries(dataSource.apiState).map(([name, conf])=> {
            return (
              <div
                key={name}
                className={cs('flex justify-between items-center cursor-pointer px-16 py-4 hover:bg-gray-200', {
                  [styles.active]: selected?.name === name,
                })}
                onClick={()=> {
                  setSelected({ name, conf });
                  setStateExpr(`apiState['${name}']`);
                }}
              >
                <span className='flex-1 flex flex-wrap items-center'>
                  {name}
                  <span className='ml-8 border border-gray-100 text-12 text-gray-400'>API 变量</span>
                </span>
                {selected?.name === name && <Icon name='check' />}
              </div>
            );
          })}
        </div>
        <div className={styles.body}>
          <Editor
            value={stateExpr}
            theme='dark'
            height="480px"
            extensions={[javascript()]}
            onChange={(value) => {
              setStateExpr(value);
            }}
          />
        </div>
      </div>
    </Modal>
  );
}

export default observer(ModalBindFor);
