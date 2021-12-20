import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Editor from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { get } from 'lodash';

import { Icon, Modal, toast, Tooltip } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';
import { isFuncSource } from '../../../utils/index';

import Section from '../../../designer/comps/section';
import BindItem from './bind-item';

import styles from './index.m.scss';

interface Props {
  className?: string;
}

type ActionName='willMount' | 'didMount' | 'willUnmount' | ''

const titleMap: Record<string, string> = {
  willMount: '页面加载之前',
  didMount: '页面加载完成时',
  willUnmount: '页面关闭时',
};

function ConfigForm(props: Props): JSX.Element {
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<ActionName>('');
  const { page } = useCtx();
  const { activeElem } = page;
  const [fn, setFn] = useState('');

  useEffect(()=> {
    setFn(get(activeElem._hooks, action, getDefaultCode()));
  }, [action]);

  function getDefaultCode(): string {
    if (action === 'willMount') {
      return 'function willMount() {}';
    }
    if (action === 'didMount') {
      return 'function didMount() {}';
    }
    if (action === 'willUnmount') {
      return 'function willUnmount() {}';
    }
    return '';
  }

  function addLifecycleHook(fn: string): void {
    if (isFuncSource(fn)) {
      const curElem = page.activeElem as PageEngine.Node;
      const hooks = Object.assign({}, curElem._hooks, { [action]: fn });
      page.updateElemProperty(curElem.id || '', '_hooks', hooks);
      setModalOpen(false);
    } else {
      toast.error('非法的函数定义');
    }
  }

  return (
    <div>
      <Section title='生命周期' defaultExpand>
        <div className='mb-8'>
          <p>页面加载之前执行</p>
          <BindItem
            bound={!!activeElem._hooks?.willMount}
            onEdit={()=> {
              setModalOpen(true);
              setAction('willMount');
            }}
            onBind={()=> {
              setModalOpen(true);
              setAction('willMount');
            }}
            onUnbind={()=> {
              page.updateElemProperty(activeElem.id || '', '_hooks.willMount', '');
              setFn('');
            }}
          />
        </div>
        <div className='mb-8'>
          <p>页面加载完成时</p>
          <BindItem
            bound={!!activeElem._hooks?.didMount}
            onEdit={()=> {
              setModalOpen(true);
              setAction('didMount');
            }}
            onBind={()=> {
              setModalOpen(true);
              setAction('didMount');
            }}
            onUnbind={()=> {
              page.updateElemProperty(activeElem.id || '', '_hooks.didMount', '');
              setFn('');
            }}
          />
        </div>
        <div>
          <p>页面关闭时</p>
          <BindItem
            bound={!!activeElem._hooks?.willUnmount}
            onEdit={()=> {
              setModalOpen(true);
              setAction('willUnmount');
            }}
            onBind={()=> {
              setModalOpen(true);
              setAction('willUnmount');
            }}
            onUnbind={()=> {
              page.updateElemProperty(activeElem.id || '', '_hooks.willUnmount', '');
              setFn('');
            }}
          />
        </div>
      </Section>
      {modalOpen && (
        <Modal
          title={`${titleMap[action]}: 绑定动作`}
          width={1200}
          height={600}
          onClose={()=> setModalOpen(false)}
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
                addLifecycleHook(fn);
              },
              text: '绑定动作',
            },
          ]}
        >
          <div className={styles.modal}>
            <div className={styles.side}>
              <div className='flex justify-between items-center cursor-pointer px-16 py-4 hover:bg-gray-200 bg-gray-200'>
                <span>添加新动作</span>
                <Icon name='check' />
              </div>
            </div>
            <div className={styles.body}>
              <Editor
                value={fn}
                height="480px"
                extensions={[javascript()]}
                onChange={(value) => {
                  setFn(value);
                }}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default observer(ConfigForm);
