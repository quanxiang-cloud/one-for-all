import React, { Fragment, CSSProperties, MouseEvent, useMemo, useCallback } from 'react';
import PageEngine2, {
  BaseBlocksCommunicationState, BlocksCommunicationState, SchemaNode, schemaNodeWithChildren, schemaNodeWithNode
} from '@one-for-all/page-engine-v2';

interface Props<T extends BaseBlocksCommunicationState> {
  node: SchemaNode;
  level?: number;
  blocksCommunicationState$: BlocksCommunicationState<T>,
}

export default function Outline({ node, level = 0, blocksCommunicationState$ }: Props<BaseBlocksCommunicationState>) {
  const { activeNodeID } = PageEngine2.useObservable(blocksCommunicationState$, { activeNodeID: '' });

  const handleNodeClick = useCallback((id: string) => {
    return (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      blocksCommunicationState$.next({
        ...blocksCommunicationState$.value,
        activeNodeID: id,
      })
    }
  }, []);

  const children = useMemo(() => {
    const style: CSSProperties = { paddingLeft: 10 * level };
    if (activeNodeID === node.id) {
      style.border = '1px solid red';
    }
    const nodeWithChildren = schemaNodeWithChildren(node);
    const nodeWithNode = schemaNodeWithNode(node);
    return (
      <Fragment>
        <div style={style} onClick={handleNodeClick(`${node.id}`)}>{node.label}</div>
        {nodeWithChildren && node.children?.map((node) => (
          <Outline level={level + 1} key={node.id} node={node} blocksCommunicationState$={blocksCommunicationState$} />
        ))}
        {nodeWithNode && (
          <Outline level={level + 1} node={node} blocksCommunicationState$={blocksCommunicationState$} />
        )}
      </Fragment>
    )
  }, [node, level, activeNodeID]);

  if (level) {
    return children;
  }

  return (
    <div className="page-engine-layer-block__menu-outline">
      {children}
    </div>
  )
}
