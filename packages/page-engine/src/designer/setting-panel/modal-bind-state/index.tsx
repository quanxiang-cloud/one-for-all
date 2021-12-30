import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import Editor from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { get } from 'lodash';

import { Modal, Icon, toast } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';
import { NodePropType } from '@ofa/render-engine';

import styles from './index.m.scss';

interface Props {
  className?: string;
}

function ModalBindState(props: Props): JSX.Element | null {
  const { designer, dataSource, page } = useCtx();
  const { setModalBindStateOpen } = designer;
  const [selected, setSelected] = useState<{name: string, conf: string} | null>(null);
  const [stateExpr, setStateExpr] = useState(''); // 绑定变量的表达式

  useEffect(()=> {
    // get shared state id
    const bindConf = get(page.activeElem, `props.${designer.activeFieldName}`, {});
    if (bindConf.type === NodePropType.SharedStateProperty) {
      const expr = `states['${bindConf.stateID}']`;
      setStateExpr(expr);
    }
  }, [page.activeElemProps]);

  function handleBind(): void {
    if (!stateExpr) {
      toast.error('变量表达式不能为空');
      return;
    }
    const propName = designer.activeFieldName;
    const match = stateExpr.match(/states\['(.+)'\]/);
    const fallbackVal = page.activeElemProps[propName]?.value;
    if (!match || !match[1]) {
      toast.error(`非法的 stateID: ${stateExpr}`);
      return;
    }
    page.updateElemProperty(page.activeElem.id, `props.${propName}`, {
      type: NodePropType.SharedStateProperty,
      stateID: match[1],
      fallback: fallbackVal,
      convertor: {
        type: 'state_convert_expression',
        // todo
        expression: 'state',
      },
    });
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
          <Editor
            value={stateExpr}
            // theme='dark'
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

export default observer(ModalBindState);
