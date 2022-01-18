import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Editor from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { pick, get } from 'lodash';
import { useUpdateEffect } from 'react-use';
import cs from 'classnames';

import { Button, Icon, Tooltip, Modal, toast } from '@ofa/ui';
import { useCtx, DataBind } from '@ofa/page-engine';

import Section from '../../comps/section';

import styles from './index.m.scss';

interface Props {
  className?: string;
}

const defaultToPropsFn = 'return state';
const defaultLoopKey = 'id';

function RendererPanel(props: Props): JSX.Element {
  const { page } = useCtx();
  const [toPropsFn, setToPropsFn] = useState(defaultToPropsFn);
  const [loopKey, setLoopKey] = useState(defaultLoopKey);
  const [modalBindConstOpen, setModalBindConstOpen] = useState(false);
  const [bindConst, setBindConst] = useState('null'); // 绑定的常量循环数据

  useEffect(()=> {
    // todo: get cur loop node conf
    const rawNode = page.rawActiveElem;
    if (rawNode.type === 'loop-container') {
      const { iterableState, loopKey, toProps } = pick(rawNode, ['iterableState', 'loopKey', 'toProps']);
      setLoopKey(loopKey);
      setToPropsFn(get(toProps, 'body', defaultToPropsFn));

      if (iterableState?.type === 'constant_property') {
        setBindConst(iterableState.value);
      }
    }
  }, [page.activeElemId]);

  useUpdateEffect(()=> {
    // console.log('sync all loop conf to elem: %s, %s, %o', toPropsFn, loopKey, toJS(bindConst));
    // todo: debounce update
    page.updateCurNodeAsLoopContainer('loopKey', loopKey || defaultLoopKey);
    page.updateCurNodeAsLoopContainer('toProps', toPropsFn || defaultToPropsFn);
  }, [toPropsFn, loopKey, bindConst]);

  function handleBindConstVal(): void {
    try {
      const bindVal = JSON.parse(bindConst);
      if (bindVal === null) {
        setModalBindConstOpen(false);
        // ignore
        return;
      }

      if (!Array.isArray(bindVal)) {
        toast.error('循环数据必须为数组');
        return;
      }

      page.updateCurNodeAsLoopContainer('iterableState', {
        type: 'constant_property',
        value: bindVal,
      });

      setModalBindConstOpen(false);
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  function hasBindConst(): boolean {
    const rawNode = page.rawActiveElem;
    if (rawNode.type === 'loop-container') {
      const isConstType = get(rawNode, 'iterableState.type') === 'constant_property';
      const val = get(rawNode, 'iterableState.value');
      if (!isConstType) {
        return false;
      }

      try {
        const parsedVal = typeof val === 'string' ? JSON.parse(val) : val;
        return Array.isArray(parsedVal);
      } catch (err: unknown) {
        return false;
      }
    }
    return false;
  }

  return (
    <>
      <div className={styles.renderPanel}>
        {/* <Section title='条件展示' defaultExpand>*/}
        {/*  <div className='flex items-center justify-between'>*/}
        {/*    <Toggle*/}
        {/*      defaultChecked*/}
        {/*      onChange={(checked: boolean)=> {*/}
        {/*        // todo: render-engine not implement shouldRender prop*/}
        {/*      }}*/}
        {/*    />*/}
        {/*    <BindItem name='shouldRender' />*/}
        {/*  </div>*/}
        {/* </Section>*/}
        <Section title='循环展示' defaultExpand>
          <form className='flex flex-col'>
            <div className='mb-8'>
              <p>循环数据</p>
              <div className='flex items-center justify-between'>
                <Button
                  className={cs({ [styles.boundConst]: hasBindConst() })}
                  onClick={()=> setModalBindConstOpen(true)}
                >
                  {hasBindConst() ? '已绑定常量数据' : '绑定常量数据'}
                </Button>
                <DataBind name='loop-node' isLoopNode />
              </div>
            </div>
            <div className='mb-8'>
              <p>循环 Key</p>
              <div className='flex items-center justify-between'>
                <input
                  className='mr-8 pg-input'
                  placeholder='默认为 id'
                  value={loopKey}
                  onChange={(ev)=> {
                    setLoopKey(ev.target.value);
                  }}
                />
              </div>
            </div>
            <div className='mb-8'>
              <p className='flex items-center'>
                <span className='mr-8'>组件属性映射函数(toProps)</span>
                <Tooltip position='top' label='将当前循环数据映射到组件属性'>
                  <Icon name='info' />
                </Tooltip>
              </p>
              <div className='text-12'>
                <p>示例:</p>
                <pre className='text-12 text-blue-400 bg-gray-100'>
                  {'// 将当前循环数据作为组件props\n 1. return state\n\n// 将当前循环数据的data属性\n// 作为组件的app属性\n 2. return { app: state.data }'}
                </pre>
                <div className='text-gray-400'>
                  <p>state 为页面引擎传入的当前变量(请勿修改名称)，您只需修改state的表达式即可。</p>
                  <p>代码编辑器只接收函数体的表达式，不需要填写完整的函数定义, 注意表达式需带上 return 关键字</p>
                </div>
              </div>
              <Editor
                value={toPropsFn}
                height="120px"
                extensions={[javascript()]}
                onChange={(value) => {
                  setToPropsFn(value);
                }}
              />
            </div>
          </form>
        </Section>
      </div>
      {modalBindConstOpen && (
        <Modal
          title='绑定常量循环数据'
          onClose={()=> setModalBindConstOpen(false)}
          footerBtns={[
            {
              key: 'close',
              iconName: 'close',
              onClick: () => setModalBindConstOpen(false),
              text: '取消',
            },
            {
              key: 'check',
              iconName: 'check',
              modifier: 'primary',
              onClick: handleBindConstVal,
              text: '绑定',
            },
          ]}
        >
          <Editor
            value={typeof bindConst === 'string' ? bindConst : JSON.stringify(bindConst)}
            height="120px"
            extensions={[javascript()]}
            onChange={(value)=> {
              setBindConst(value);
            }}
          />
        </Modal>
      )}
    </>

  );
}

export default observer(RendererPanel);
