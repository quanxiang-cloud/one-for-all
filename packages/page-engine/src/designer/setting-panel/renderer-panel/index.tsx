import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Editor from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

import { Button, Icon, Tooltip } from '@ofa/ui';
import { useCtx, LoopNodeConf, DataBind } from '@ofa/page-engine';

import Section from '../../comps/section';

import styles from './index.m.scss';

interface Props {
  className?: string;
}

function RendererPanel(props: Props): JSX.Element {
  const { page } = useCtx();
  const [values, setValues] = useState<LoopNodeConf>(getCurNodeLoopConf());
  const [toPropsFn, setToPropsFn] = useState('// return state');

  useEffect(()=> {
    // todo
    setValues(getCurNodeLoopConf());
  }, [page.activeElemId]);

  // loop node current config
  function getCurNodeLoopConf(): LoopNodeConf {
    return {
      // fixme
      iterableState: {
        // convertor: {
        //   expression: 'state.data',
        //   type: 'state_convert_expression',
        // },
        // fallback: [],
        // stateID: 'my-apps',
        // type: NodePropType.SharedStateProperty,
      } as any,
      loopKey: 'id',
      toProps: 'return state',
    };
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
                <Button>绑定常量数据</Button>
                <DataBind name='loop-node' isLoopNode />
              </div>
            </div>
            <div className='mb-8'>
              <p>循环 Key</p>
              <div className='flex items-center justify-between'>
                <input
                  className='mr-8 pg-input'
                  placeholder='默认为 id'
                  value={values.loopKey}
                  onChange={(ev)=> {
                    setValues((prev)=> ({ ...prev, loopKey: ev.target.value }));
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
    </>

  );
}

export default observer(RendererPanel);
