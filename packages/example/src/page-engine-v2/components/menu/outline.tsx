import React, { Fragment, CSSProperties } from 'react';
import type { SchemaNode } from '@one-for-all/page-engine-v2';

interface Props {
  node: SchemaNode;
  level?: number;
  activeNodeID: string;
}

export default function Outline({ node, level = 0, activeNodeID }: Props) {
  const { type } = node;
  if (type !== 'html-element' && type !== 'react-component') {
    return null;
  }
  const isSelected = activeNodeID === node.id;
  const style: CSSProperties = { paddingLeft: 10 * level };
  if (isSelected) {
    style.border = '1px solid red';
  }

  if (level) {
    return (
      <Fragment>
        <div style={style}>{node.label}</div>
        {node.children?.map((node) => (
          <Outline node={node} activeNodeID={activeNodeID} />
        ))}
      </Fragment>
    )
  }

  return (
    <div className="page-engine-layer-block__menu-outline">
      <div style={style}>{node.label}</div>
      {node.children?.map((node) => (
        <Outline key={node.id} node={node} activeNodeID={activeNodeID} />
      ))}
    </div>
  )
}
