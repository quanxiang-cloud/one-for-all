import React from 'react';
import { observer } from 'mobx-react';
import cs from 'classnames';
import { get } from 'lodash';

import { Icon, Tooltip } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';
import { NodePropType } from '@ofa/render-engine';

interface Props {
  name: string; // bind field name
  className?: string;
}

function ConfigItemBind({ name }: Props): JSX.Element {
  const { designer, page } = useCtx();
  const bound = get(page.activeElem, `props.${name}.type`) === NodePropType.SharedStateProperty;

  return (
    <div className='inline-flex items-center'>
      <Tooltip position='top' label={bound ? '编辑绑定' : '绑定变量'}>
        <Icon
          name="code"
          color="gray"
          clickable
          onClick={()=> designer.openDataBinding(name)}
          className={cs('mr-8', bound ? 'bg-blue-200' : '')}
        />
      </Tooltip>
      {bound && (
        <Tooltip position='top' label='解绑'>
          <Icon
            name='link'
            clickable
            onClick={()=> {
              const { fallback } = get(page.activeElem, `props.${name}`, {});
              page.updateElemProperty(page.activeElem.id, `props.${name}`, {
                type: NodePropType.ConstantProperty,
                value: fallback,
              });
            }} />
        </Tooltip>
      )}
    </div>
  );
}

export default observer(ConfigItemBind);
