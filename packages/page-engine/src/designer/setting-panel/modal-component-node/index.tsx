import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Editor from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import cs from 'classnames';
import { toJS } from 'mobx';
import { get } from 'lodash';

import { Modal, Icon, Tooltip, toast } from '@one-for-all/ui';
import { useCtx, PageNode } from '../../../index';

type LabelValue = {
  label: string;
  value: string;
}

function ModalComponentNode(): JSX.Element {
  const { designer, dataSource, page } = useCtx();
  const [selected, setSelected] = useState<{name: string, conf: string} | null>(null);
  const [nodeChildren, setNodeChildren] = useState<PageNode[]>([]);
  const [stateExpr, setStateExpr] = useState(''); // 绑定变量的表达式
  const [selectValue, setSelectValue] = useState('');
  const [toPropsValue, setToPropsValue] = useState('');
  const [selectOptions, setSelectOptions] = useState<LabelValue[]>([]);

  const { setModalComponentNodeOpen, activeFieldName, isComponentNode } = designer;

  useEffect(() => {
    if (page.activeElem) {
      const _nodeChildren = initialComposedNodeChildren(toJS(page.activeElem || {}));
      const _selectOptions = _nodeChildren.map((item) => {
        return ({
          label: item.label,
          value: item.id,
        });
      });
      setSelectOptions(_selectOptions);
      setNodeChildren(_nodeChildren);
      if (_selectOptions.length > 0) {
        setSelectValue(_selectOptions[0].value || '');
        setToPropsValue(_nodeChildren[0].toProps.body || '');
      }
    }
  }, []);

  useEffect(()=> {
    let bindConf;
    if (isComponentNode) {
      // todo: get loop node iterableState bind value
      bindConf = get(page.rawActiveElem, 'iterableState', {});
    } else {
      bindConf = get(page.activeElem, `props.${activeFieldName}`, {});
    }

    if (bindConf.type === 'shared_state_property') {
      const expr = `states['${bindConf.stateID}']`;
      setStateExpr(expr);
      // setConvertorExpr(get(bindConf, 'convertor.expression', ''));
    }

    if (bindConf.type === 'api_result_property') {
      const expr = `apiStates['${bindConf.stateID}']`;
      setStateExpr(expr);
      // setConvertorExpr(get(bindConf, 'convertor.expression', ''));
    }
    if (bindConf.type === 'shared_state_mutation_property') {
      // todo
    }
  }, [page.activeElemId]);

  function initialComposedNodeChildren(node: PageNode): Array<PageNode> {
    const newChildren = (node.children || []).map((child) => {
      const { type, args, body } = child.toProps || {};
      child.toProps = {
        type: type || 'to_props_function_spec',
        args: args || 'state',
        body: body || 'return {}',
      };
      return child;
    });

    return newChildren;
  }

  function handleBind(): void {
    const _nodeChildren = [...nodeChildren];
    _nodeChildren.map((node) => {
      if (node.id === selectValue) {
        node.toProps.body = toPropsValue;
      }
      return node;
    });

    if (!stateExpr) {
      toast.error('变量表达式不能为空');
      return;
    }

    const match = stateExpr.match(/states\['(.+)'\]/i);
    if (!match || !match[1]) {
      toast.error(`无效的 stateID: ${stateExpr}`);
      return;
    }

    const nodeType = stateExpr.includes('apiStates[') ? 'api_result_property' : 'shared_state_property';

    // if (isLoopNode) {
    const iterableState = {
      type: nodeType,
      stateID: match[1],
      fallback: [],
      convertor: {
        type: 'state_convert_expression',
        expression: 'state',
      },
    };
    const node = toJS(page.activeElem);
    const _node = { ...node };
    delete _node.children;

    page.updateCurNodeAsComposedNode('iterableState', {
      iterableState,
      node: {
        ...node,
        id: node.id,
        type: 'composed-node',
        outLayer: { ..._node },
        children: _nodeChildren,
      },
    });
    // // }
    setModalComponentNodeOpen(false);
  }

  function handleComponentChange(e: React.ChangeEvent<HTMLSelectElement>): void {
    const _nodeChildren = [...nodeChildren];
    const _id = e.target.value;
    let _value = '';
    _nodeChildren.map((node) => {
      if (node.id === selectValue) {
        node.toProps.body = toPropsValue;
        return node;
      }

      if (node.id === _id) {
        _value = node.toProps.body || '';
      }
      return node;
    });
    setToPropsValue(_value);
    setNodeChildren(_nodeChildren);
    setSelectValue(_id);
  }

  function handleChildrenPropsChange(value: string): void {
    setToPropsValue(value);
  }

  return (
    <Modal
      title="设置循环规则"
      onClose={()=> setModalComponentNodeOpen(false)}
      footerBtns={[
        {
          key: 'close',
          iconName: 'close',
          onClick: () => setModalComponentNodeOpen(false),
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
      <div className='grid h-full' style={{ gridTemplateColumns: '212px 1fr' }}>
        <div className='bg-gray-50 border'>
          {Object.entries(dataSource.sharedState).map(([name, conf])=> {
            const checked = selected?.name === name || stateExpr.includes(`['${name}']`);
            return (
              <div
                key={name}
                className={cs('flex justify-between items-center',
                  'cursor-pointer px-16 py-4 hover:bg-gray-200', {
                    'bg-gray-200': checked,
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
                className={cs('flex justify-between items-center',
                  'cursor-pointer px-16 py-4 hover:bg-gray-200', {
                    'bg-gray-200': checked,
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
        <div className='px-8'>
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
          <div className='mt-8'>
            <div className='flex items-center'>
              <span>当前组件：</span>
              <select value={selectValue} onChange={handleComponentChange}>
                {selectOptions.map((item) => {
                  return (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  );
                })}
              </select>
            </div>
            <Editor
              value={toPropsValue}
              height="200px"
              extensions={[javascript()]}
              onChange={handleChildrenPropsChange}
            />
            {/* <Select
              className="my-8 w-full mr-4"
              // options={selectOptions}
              options={[
                { label: 1, value: '1' },
              ]}
              // value={selectValue}
              // onChange={(value) => setValues({ ...values, fillMode: value })}
            /> */}

          </div>
        </div>
      </div>
    </Modal>
  );
}

export default observer(ModalComponentNode);
