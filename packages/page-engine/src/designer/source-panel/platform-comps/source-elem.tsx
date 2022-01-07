import React from 'react';
import { useDrag } from 'react-dnd';
import cs from 'classnames';

import { Icon } from '@ofa/ui';
import { useCtx, SourceElement } from '@ofa/page-engine';

import styles from './index.m.scss';

function SourceElem(props: SourceElement<any>): JSX.Element {
  const { page, registry } = useCtx();
  const compName = props.name.toLowerCase();

  function addNodeToCanvas(target?: any): void {
    const { defaultStyle } = props;
    page.appendNode({
      exportName: compName,
      label: registry.getLabelByElemType(compName),
      defaultStyle: {
        // ...InitStyles,
        ...defaultStyle,
      },
    }, target, { from: 'source' });
  }

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'source_elem',
    item: { exportName: compName, label: props.label },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const targetNode: any = monitor.getDropResult();
      if (targetNode?.exportName) {
        // console.log('[source-elem] dropped %o onto: %o', item, targetNode);
        addNodeToCanvas(targetNode);
      }
    },
  }));

  return (
    <div
      className={cs(styles.sourceElem, { [styles.dragging]: isDragging })}
      ref={drag}
      onClick={addNodeToCanvas}
    >
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
