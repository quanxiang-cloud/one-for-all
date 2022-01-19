import React, { useState } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import { LoopNode, PageNode, useCtx } from '@ofa/page-engine';
import { Icon } from '@ofa/ui';

import styles from './index.m.scss';

interface NodeItemProps {
  node: PageNode | LoopNode;
  level: number;
  onSelect?: (node: PageNode) => void;
}

function NodeItem({ node: rawNode, level, onSelect }: NodeItemProps): JSX.Element {
  const { page } = useCtx();
  const isLoopNode = rawNode.type === 'loop-container';
  const node = (isLoopNode ? (rawNode as LoopNode).node : rawNode) as PageNode;
  const hasChild = node.children && node.children.length > 0;
  const [expand, setExpand] = useState(hasChild);

  return (
    <>
      <div
        style={{ paddingLeft: (10 * level) + 'px' }}
        key={node.id}
        className={cs('hover:bg-blue-200 flex items-center cursor-pointer', styles.node, {
          'bg-blue-200': page.activeElemId === node.id,
        })}
        onClick={() => {
          onSelect?.(node);
        }}
      >
        {hasChild && (
          <Icon
            size={16}
            clickable
            name={expand ? 'expand_more' : 'expand_less'}
            onClick={()=> setExpand(!expand)}
          />
        )}
        <span style={{ lineHeight: '36px' }} className='flex-1 truncate'>
          {node.label}
        </span>
      </div>
      {node.children && (
        <div
          className={cs('flex flex-col', styles.subNodes, {
            [styles.hide]: !expand,
          })}
        >
          {node.children.map((c)=> (
            <NodeItem
              key={c.id}
              node={c}
              level={level + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </>
  );
}

const ObserveNodeItem = observer(NodeItem);

function TreeView(): JSX.Element {
  const { page } = useCtx();

  function handleSelect(node: PageNode): void {
    page.setActiveElemId(node.id);
    // console.log('select node: ', toJS(node));
  }

  function renderNode(node: PageNode, level: number): JSX.Element {
    return React.createElement(ObserveNodeItem, { node, level, onSelect: handleSelect },
      ...(node?.children || []).map((child) => renderNode(child, level + 1)));
  }

  return (
    <div className={cs('mt-8', styles.treeView)}>
      {renderNode(page.schema.node, 0)}
    </div>
  );
}

export default observer(TreeView);
