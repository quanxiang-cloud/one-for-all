import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Editor from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

import { Toggle, Button, Icon, Tooltip } from '@ofa/ui';
import { useCtx, LoopNodeConf } from '@ofa/page-engine';

import Section from '../../comps/section';
import BindItem from '../../comps/config-item-bind';

import styles from './index.m.scss';

interface Props {
  className?: string;
}

function RendererPanel(props: Props): JSX.Element {
  const { page } = useCtx();
  const [values, setValues] = useState<LoopNodeConf>(getCurNodeLoopConf());
  const [toPropsFn, setToPropsFn] = useState('// return {prop_name: state}');

  useEffect(()=> {
    setValues(getCurNodeLoopConf);
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
      toProps: {
        type: 'to_props_function_spec',
        args: 'state',
        body: 'return { appInfo: state }',
      },
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
                <Button>编辑常量数据</Button>
                <BindItem name='loop-node' isLoopNode />
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
                <span className='mr-8'>属性转换函数</span>
                <Tooltip position='top' label='将循环的当前数据映射到组件属性'>
                  <Icon name='info' />
                </Tooltip>
              </p>
              <div className='text-12'>
                <p>示例:</p>
                <pre className='text-12 text-blue-400 bg-gray-100'>
                  {'return {prop_name: state}'}
                </pre>
                <div className='text-gray-400'>
                  <p>prop_name 为被渲染组件的属性，state 为页面引擎内部传入的当前循环变量(请勿修改名称)，您只需修改prop_name即可。</p>
                  <p>代码编辑器只接收函数体的表达式，不需要填写完整的函数定义</p>
                </div>
              </div>
              <Editor
                value={toPropsFn}
                height="200px"
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
