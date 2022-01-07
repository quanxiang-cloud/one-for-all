import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import Editor from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { get } from 'lodash';

import { Icon, Modal, toast, Tooltip } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';
import { NodePropType } from '@ofa/render-engine';

import styles from './index.m.scss';

interface Props {
  className?: string;
}

function ModalBindState(props: Props): JSX.Element | null {
  const { designer, dataSource, page } = useCtx();
  const { setModalBindStateOpen, activeFieldName, isLoopNode } = designer;
  const [selected, setSelected] = useState<{name: string, conf: string} | null>(null);
  const [stateExpr, setStateExpr] = useState(''); // 绑定变量的表达式
  const [convertorExpr, setConvertorExpr] = useState('state'); // 绑定变量的convertor表达式
  const [toPropsExpr, setToPropsExpr] = useState('return state'); // 绑定变量的toProps表达式

  useEffect(()=> {
    if (isLoopNode) {
      // todo
    } else {
      // get shared state id
      const bindConf = get(page.activeElem, `props.${activeFieldName}`, {});
      if (bindConf.type === NodePropType.SharedStateProperty) {
        const expr = `states['${bindConf.stateID}']`;
        setStateExpr(expr);
        setConvertorExpr(get(bindConf, 'convertor.expression', ''));
      }

      if (bindConf.type === NodePropType.APIResultProperty) {
        const expr = `apiStates['${bindConf.stateID}']`;
        setStateExpr(expr);
        setConvertorExpr(get(bindConf, 'convertor.expression', ''));
      }
      if (bindConf.type === NodePropType.SharedStateMutationProperty) {
        // todo
      }
    }
  }, [page.activeElemId]);

  function handleBind(): void {
    if (!stateExpr) {
      toast.error('变量表达式不能为空');
      return;
    }
    if (!convertorExpr) {
      toast.error('变量转换函数不能为空');
      return;
    }
    if (convertorExpr.indexOf('state') < 0) {
      toast.error('变量转换函数必须包含 state 来引用当前变量值');
      return;
    }

    const match = stateExpr.match(/states\['(.+)'\]/i);
    if (!match || !match[1]) {
      toast.error(`无效的 stateID: ${stateExpr}`);
      return;
    }

    const nodeType = stateExpr.includes('apiStates[') ? NodePropType.APIResultProperty : NodePropType.SharedStateProperty;

    if (isLoopNode) {
      if (!page.activeElem.iterableState) {
        // replace current normal node to loop node
        page.setNodeAsLoopContainer(page.activeElemId, {
          iterableState: {
            type: nodeType,
            stateID: match[1],
            fallback: [],
            convertor: {
              type: 'state_convert_expression',
              expression: convertorExpr,
            },
          },
          // todo
          loopKey: 'id',
          toProps: toPropsExpr,
        });
      } else {
        // todo: update loop node config
      }
    } else {
      const fallbackVal = page.activeElemProps[activeFieldName]?.value;
      page.updateElemProperty(page.activeElem.id, `props.${activeFieldName}`, {
        type: nodeType,
        stateID: match[1],
        fallback: fallbackVal,
        convertor: {
          type: 'state_convert_expression',
          expression: convertorExpr,
        },
      });
    }

    setModalBindStateOpen(false);
  }

  return (
    <Modal
      title='变量绑定'
      onClose={()=> setModalBindStateOpen(false)}
      footerBtns={[
        {
          key: 'close',
          iconName: 'close',
          onClick: () => setModalBindStateOpen(false),
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
            const checked = selected?.name === name || stateExpr.includes(`['${name}']`);
            return (
              <div
                key={name}
                className={cs('flex justify-between items-center cursor-pointer px-16 py-4 hover:bg-gray-200', {
                  [styles.active]: checked,
                })}
                onClick={()=> {
                  setSelected({ name, conf });
                  setStateExpr(`states['${name}']`);
                }}
              >
                <span className='flex-1 flex flex-wrap items-center'>
                  {name}
                  <span className='ml-8 border border-gray-100 text-12 text-gray-400'>普通变量</span>
                </span>
                {checked && <Icon name='check' />}
              </div>
            );
          })}
          {Object.entries(dataSource.apiState).map(([name, conf])=> {
            const checked = selected?.name === name || stateExpr.includes(`['${name}']`);
            return (
              <div
                key={name}
                className={cs('flex justify-between items-center cursor-pointer px-16 py-4 hover:bg-gray-200', {
                  [styles.active]: checked,
                })}
                onClick={()=> {
                  setSelected({ name, conf });
                  setStateExpr(`apiStates['${name}']`);
                }}
              >
                <span className='flex-1 flex flex-wrap items-center'>
                  {name}
                  <span className='ml-8 border border-gray-100 text-12 text-gray-400'>API 变量</span>
                </span>
                {checked && <Icon name='check' />}
              </div>
            );
          })}
        </div>
        <div className={styles.body}>
          <div className='mb-8'>
            <p className='flex items-center'>
              <span className='mr-8'>变量表达式</span>
              <Tooltip position='top' label='请选择普通变量 或 api变量'>
                <Icon name='info' />
              </Tooltip>
            </p>
            <Editor
              value={stateExpr}
              height="200px"
              extensions={[javascript()]}
              onChange={setStateExpr}
            />
          </div>
          <div className='mb-8'>
            <p className='flex items-center'>
              <span className='mr-8'>变量转换函数(state convertor)</span>
              <Tooltip position='top' label='将初始变量进行一次转换，一般用于 api 变量'>
                <Icon name='info' />
              </Tooltip>
            </p>
            <div className='text-12'>
              <p>示例:</p>
              <pre className='text-12 text-blue-400 bg-gray-100'>
                {'state.user_name'}
              </pre>
              <div className='text-gray-400'>
                <p>state 为页面引擎传入的当前变量(请勿修改名称)，您只需修改state的表达式即可。</p>
                <p>代码编辑器只接收函数体的表达式，不需要填写完整的函数定义</p>
              </div>
            </div>
            <Editor
              value={convertorExpr}
              height="120px"
              extensions={[javascript()]}
              onChange={setConvertorExpr}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default observer(ModalBindState);
