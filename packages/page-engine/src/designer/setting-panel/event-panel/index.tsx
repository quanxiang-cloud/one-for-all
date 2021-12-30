import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { get } from 'lodash';
import Editor from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

import { Select, RadioGroup, Radio, Modal, Icon, Button, toast } from '@ofa/ui';
import { PageNode, useCtx } from '@ofa/page-engine';
import { NodePropType } from '@ofa/render-engine';
import BindItem from './bind-item';
import { isFuncSource } from '../../../utils';

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
      const rawFn = get(page.activeElem.lifecycleHooks, `${curAction}.body`);
      if (!rawFn) {
        setFn(getDefaultFunc());
      } else {
        setFn(rawFn.substring(11, rawFn.length - '; return fn(...args)'.length) || getDefaultFunc());
      }
    }
  }, [page.activeElemId, curAction]);

  function addAction(fn: string): void {
    if (isFuncSource(fn)) {
      if (builtInEvents.includes(curAction)) {
        page.updateElemProperty(page.activeElemId, `lifecycleHooks.${curAction}`, {
          type: 'lifecycle_hook_func_spec',
          args: '...args',
          body: `const fn = ${fn}; return fn(...args)`,
        });
      } else {
        page.updateElemProperty(page.activeElemId, `props.${curAction}`, {
          // type: NodePropType.APIInvokeProperty,
          type: NodePropType.FunctionalProperty,
          func: {
            type: '',
            args: '...args',
            body: `const fn = ${fn}; return fn(...args)`,
          },
        });
      }

      setModalOpen(false);
    } else {
      toast.error('非法的函数定义');
    }
  }

  function getDefaultFunc(): string {
    return `function customAction(params) {\n  // this.apiStates['my-apps'].fetch();\n}`;
  }

  function isActionBound(actionName: string): boolean {
    if (builtInEvents.includes(actionName)) {
      return !!get(page.activeElem.lifecycleHooks, actionName);
    }
    // todo: just check type is functional property?
    return get(elemProps, `${curAction}.type`) === NodePropType.FunctionalProperty;
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
                    name={ac}
                    bound={isActionBound(ac)}
                    onEdit={()=> {
                      setCurAction(ac);
                      setModalOpen(true);
                    }}
                    onUnbind={()=> {
                      if (builtInEvents.includes(curAction)) {
                        page.updateElemProperty(page.activeElemId, `lifecycleHooks.${curAction}`, '');
                      } else {
                        page.updateElemProperty(page.activeElem.id, `props.${curAction}`, '');
                      }
                      // setFn('');
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
              <RadioGroup onChange={(val: any) => setType(val)}>
                {/* <Radio label='平台方法' value='platform' defaultChecked={eventType === 'platform'} />*/}
                <Radio label='自定义方法' value='custom' defaultChecked={eventType === 'custom'} />
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

export default observer(EventPanel);
