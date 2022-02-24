import React from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';
import { get } from 'lodash';

import { Icon, Tooltip } from '@one-for-all/ui';
import { useCtx } from '../../../index';
import type { NodePropType } from '@one-for-all/schema-spec';

interface Props {
  name: string; // bind field name
  className?: string;
  isRootProps?: boolean;
  isLoopNode?: boolean;
  isComposedNode?: boolean;
  unBind?: () => void;
}

const iterableStateTypes: NodePropType[] = [
  'shared_state_property',
  'api_result_property',
  'constant_property',
];

const normalStateTypes: NodePropType[] = [
  'shared_state_property',
  'api_result_property',
];

function ConfigItemBind({ name, isRootProps, isLoopNode, isComposedNode, unBind }: Props): JSX.Element {
  const { designer, page } = useCtx();
  let bound;
  if (isLoopNode) {
    // if bind constant value, loop node iterableState will be constant_property
    // if bind shared state, loop node iterableState will be shared_property
    // if bind api state, loop node iterableState will be api_result_property
    const iterType = get(page.rawActiveElem, 'iterableState.type');
    bound = iterableStateTypes.includes(iterType);
  } else {
    const typePath = isRootProps ? `${name}.type` : `props.${name}.type`;
    const propType = get(page.activeElem, typePath);
    bound = normalStateTypes.includes(propType);
  }

  function handleUnbind(): void {
    if (isLoopNode && !isComposedNode) {
      // replace loop node with inner normal node, detach iterable state prop
      page.unsetLoopNode(page.activeElemId);
    } else if (isComposedNode) {
      page.unsetComposedNode(page.activeElemId);
    } else {
      const propPath = isRootProps ? name : `props.${name}`;
      const { fallback } = get(page.activeElem, propPath, {});
      page.updateElemProperty(page.activeElem.id, propPath, {
        type: 'constant_property',
        value: fallback,
      });
    }
  }

  function handleChecked(): void {
    const { exportName } = page.activeElem;
    if (exportName === 'container' && isLoopNode) {
      designer.openComponentNodeBinding(name, isLoopNode);
    } else {
      designer.openDataBinding(name, isLoopNode, isRootProps);
    }
  }

  return (
    <div className='inline-flex items-center'>
      <Tooltip position='top' label={bound ? '编辑绑定' : '绑定变量'}>
        <Icon
          name="code"
          color="gray"
          clickable
          onClick={handleChecked}
          className={cs('mr-8', bound ? 'bg-blue-200' : '')}
        />
      </Tooltip>
      {bound && (
        <Tooltip position='top' label='解绑'>
          <Icon
            name='link'
            clickable
            onClick={unBind ? unBind : handleUnbind}
          />
        </Tooltip>
      )}
    </div>
  );
}

export default observer(ConfigItemBind);
