import React from 'react';
import { useDrag } from 'react-dnd';
import cs from 'classnames';
import { toJS } from 'mobx';

import { Icon } from '@one-for-all/ui';
import { useCtx, SourceElement } from '../../../index';

import styles from './index.m.scss';

function SourceElem(props: SourceElement<any>): JSX.Element {
  const { page, registry, designer } = useCtx();
  const compName = props.name.toLowerCase();

  function addNodeToCanvas(target?: any): void {
    const { defaultStyle, defaultConfig } = props;
    page.appendNode({
      exportName: compName,
      label: registry.getLabelByElemType(compName),
      defaultConfig: toJS(defaultConfig),
      defaultStyle: {
        // ...InitStyles,
        ...defaultStyle,
      },
    }, target, { from: 'source' });
    !designer.panelPinned && designer.setPanelOpen(false);
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
        // console.log('[source-elem] dropped %o onto: %o, pos: %s', item, targetNode, page.dragPos);
        addNodeToCanvas(targetNode);
      }
    },
  }));

  return (
    <div
      className={cs(styles.sourceElem, { [styles.dragging]: isDragging })}
      ref={drag}
      onClick={() => addNodeToCanvas()}
    >
      <div className='w-full h-40 flex items-center justify-center bg-gray-50'>
        <Icon
          name={props.icon || 'insert_drive_file'}
          size={48}
        />
      </div>
      <div>
        {props.label}
      </div>
    </div>
  );
}

export default SourceElem;
