import React from 'react';
// import type { HTMLNode, ReactComponentNode } from '@one-for-all/artery-renderer';
// import { NodePrimary } from '../../../types';

// interface Props {
//   parentNode: HTMLNode | ReactComponentNode;
// }

// export function getParentNode(parent: HTMLNode | ReactComponentNode): NodePrimary {
//   if (parent.type === 'html-element') {
//     return { type: 'html-element', name: parent.name };
//   }

//   return {
//     type: 'react-component',
//     packageName: parent.packageName,
//     packageVersion: parent.packageVersion,
//     exportName: parent.exportName,
//   };
// }

function EmptyPlaceholder(): JSX.Element {
  return <div>请拖拽组件到此处！</div>;
}

function Placeholder(): JSX.Element | null {
  return React.createElement(
    'div',
    { className: 'placeholder-for-container-node-children' },
    React.createElement(EmptyPlaceholder),
  );
}

export default Placeholder;
