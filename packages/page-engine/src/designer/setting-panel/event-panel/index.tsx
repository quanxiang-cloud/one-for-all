import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { get } from 'lodash';
import Editor from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

import { Select, RadioGroup, Radio, Modal, Icon, Button, toast } from '@ofa/ui';
import { PageNode, useCtx } from '@ofa/page-engine';
import BindItem from './bind-item';

import styles from './index.m.scss';

interface Props {
  className?: string;
}

const builtInEvents = ['didMount', 'willUnmount'];

function EventPanel({ className }: Props): JSX.Element {
  const { page } = useCtx();
  const [eventType, setType] = useState('custom');
  const [modalOpen, setModalOpen] = useState(false);
  const [curAction, setCurAction] = useState('');
  const [fn, setFn] = useState('');
  const elemProps = page.activeElem.props as PageNode;

  useEffect(()=>{
    if (curAction) {
      let rawFn = '';
      if (builtInEvents.includes(curAction)) {
        rawFn = get(page.activeElem.lifecycleHooks, `${curAction}.body`);
      } else {
        rawFn = get(page.activeElem, `props.${curAction}.func.body`);
      }
      setFn(rawFn || getDefaultFunc());
    }
  }, [page.activeElemId, curAction, modalOpen]);

  function addAction(fn: string): void {
    // todo: validate func
    if (fn) {
      if (builtInEvents.includes(curAction)) {
        page.updateElemProperty(page.activeElemId, `lifecycleHooks.${curAction}`, {
          type: 'lifecycle_hook_func_spec',
          args: '...args',
          // body: `const fn = ${fn}; return fn(...args)`,
          body: fn,
        });
      } else {
        page.updateElemProperty(page.activeElemId, `props.${curAction}`, {
          // type: 'api_invoke_property',
          type: 'functional_property',
          func: {
            type: '',
            args: '...args',
            body: fn,
          },
        });
      }

      setModalOpen(false);
    } else {
      toast.error('非法的函数定义');
    }
  }

  function getDefaultFunc(): string {
    // return `function customAction(params) {\n  // this.apiStates['my-apps'].fetch();\n}`;
    return `// this.apiStates['get-apps'].fetch()`;
  }

  function isActionBound(actionName: string): boolean {
    if (builtInEvents.includes(actionName)) {
      return !!get(page.activeElem.lifecycleHooks, actionName);
    }
    // todo: just check type is functional property?
    return get(elemProps, `${actionName}.type`) === 'functional_property';
  }

  function renderBoundActions(): JSX.Element {
    const exportedActions = page.getElemBoundActions();

    return (
      <>
        {curAction && !isActionBound(curAction) && (
          <div className='mb-8'>
            <Button
              modifier='primary'
              iconName='add'
              className={styles.btnAddAction}
              onClick={()=> setModalOpen(true)}
            >
              绑定动作
            </Button>
          </div>
        )}
        {exportedActions.filter(isActionBound).length > 0 && (
          <div className='mb-8'>
            <p className='text-12 text-gray-600'>已绑定事件</p>
            <div>
              {exportedActions.map((ac)=> {
                return (
                  <BindItem
                    key={ac}
                    name={ac}
                    bound={isActionBound(ac)}
                    onEdit={()=> {
                      setCurAction(ac);
                      setModalOpen(true);
                    }}
                    onUnbind={()=> {
                      if (builtInEvents.includes(ac)) {
                        page.updateElemProperty(page.activeElemId, `lifecycleHooks.${ac}`, '');
                      } else {
                        page.updateElemProperty(page.activeElem.id, `props.${ac}`, '');
                      }
                      setFn('');
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={cs(styles.eventPanel, className)}>
      <div className='mb-8'>
        <p className='text-12 text-gray-600'>触发条件</p>
        <Select
          options={page.getElemBoundActions().map((value)=> ({ label: value, value }))}
          value={curAction}
          onChange={setCurAction}
        />
      </div>
      {renderBoundActions()}
      {modalOpen && (
        <Modal
          title='事件绑定'
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
                addAction(fn);
              },
              text: '绑定动作',
            },
          ]}
        >
          <div className={styles.modal}>
            <div className={styles.eventType}>
              <p className='text-12 text-gray-600'>动作类型</p>
              {/* @ts-ignore */}
              <RadioGroup onChange={(val: any) => setType(val)}>
                {/* <Radio key='platform' label='平台方法' value='platform' defaultChecked={eventType === 'platform'} />*/}
                <Radio key='custom' label='自定义方法' value='custom' defaultChecked={eventType === 'custom'} />
              </RadioGroup>
            </div>
            <div className={styles.side}>
              <div className='flex justify-between items-center cursor-pointer px-16 py-4 hover:bg-gray-200 bg-gray-200'>
                <span>添加新动作</span>
                <Icon name='check' />
              </div>
            </div>
            <div className={styles.body}>
              <Editor
                value={fn}
                height="400px"
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

export default observer(EventPanel);
