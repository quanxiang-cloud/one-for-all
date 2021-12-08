import React, { useContext } from 'react';
import { useDrag } from 'react-dnd';
import cs from 'classnames';

import { Icon } from '@ofa/ui';
import ctx from '../../../ctx';

import styles from './index.m.scss';

interface Props {
  className?: string;
}

function SourceElem(props: Registry.SourceElement<any>) {
  const { page, registry } = useContext(ctx);
  const compName = ['elem', props.name.toLowerCase()].join('.');

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'source_elem',
    item: { comp: compName, label: props.label },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const targetNode: any = monitor.getDropResult();
      if (targetNode?.comp) {
        console.log('[source-elem] dropped %o onto: %o', item, targetNode);
        page.appendNode({
          comp: compName,
          label: registry.getLabelByElemType(compName),
        }, targetNode, { from: 'source' });
      }
    },
  }));

  return (
    <div className={cs(styles.sourceElem, { [styles.dragging]: isDragging })} ref={drag}>
      <div>
        <Icon name={props.icon || 'apps'} size={24} />
      </div>
      <div>
        {props.label}
      </div>
    </div>
  );
}

export default SourceElem;
