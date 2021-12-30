import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Editor from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { get } from 'lodash';

import { Icon, Modal, toast } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';

import Section from '../../../designer/comps/section';
import BindItem from './bind-item';

import styles from './index.m.scss';

interface Props {
  className?: string;
}

type ActionName='didMount' | 'willUnmount' | ''

const titleMap: Record<string, string> = {
  didMount: '页面加载完成时',
  willUnmount: '页面关闭时',
};

// const regFn = new RegExp('const fn = (.+); return fn\\(...args\\)');

function ConfigForm(props: Props): JSX.Element {
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<ActionName>('');
  const { page } = useCtx();
  const { activeElem } = page;
  const [fn, setFn] = useState('');

  useEffect(()=> {
    const rawFn = get(activeElem.lifecycleHooks, `${action}.body`);
    setFn(rawFn || getDefaultCode());

    // if (!rawFn) {
    //   setFn(rawFn || getDefaultCode());
    // } else {
    //   setFn(rawFn.substring(11, rawFn.length - '; return fn(...args)'.length) || getDefaultCode());
    // }
  }, [action]);

  function getDefaultCode(): string {
    if (action === 'didMount') {
      // return 'function didMount() {}';
      return '// console.log(\'page load\')';
    }
    if (action === 'willUnmount') {
      // return 'function willUnmount() {}';
      return '// console.log(\'page unload\')';
    }
    return '';
  }

  function addLifecycleHook(fn: string): void {
    // if (isFuncSource(fn)) {
    if (fn) {
      page.updateElemProperty(page.activeElemId, `lifecycleHooks.${action}`, {
        type: 'lifecycle_hook_func_spec',
        args: '...args',
        // body: `const fn = ${fn}; return fn(...args)`,
        body: fn,
      });
      setModalOpen(false);
    } else {
      toast.error('非法的函数定义');
    }
  }

  return (
    <div>
      <Section title='生命周期' defaultExpand>
        <div className='mb-8'>
          <p>页面加载完成时</p>
          <BindItem
            bound={!!activeElem.lifecycleHooks?.didMount}
            onEdit={()=> {
              setModalOpen(true);
              setAction('didMount');
            }}
            onBind={()=> {
              setModalOpen(true);
              setAction('didMount');
            }}
            onUnbind={()=> {
              page.updateElemProperty(activeElem.id || '', 'lifecycleHooks.didMount', '');
              setFn('');
            }}
          />
        </div>
        <div>
          <p>页面关闭时</p>
          <BindItem
            bound={!!activeElem.lifecycleHooks?.willUnmount}
            onEdit={()=> {
              setModalOpen(true);
              setAction('willUnmount');
            }}
            onBind={()=> {
              setModalOpen(true);
              setAction('willUnmount');
            }}
            onUnbind={()=> {
              page.updateElemProperty(activeElem.id || '', 'lifecycleHooks.willUnmount', '');
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
