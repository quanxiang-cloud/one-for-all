import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import type { Node } from '@one-for-all/artery';

import artery from './root-artery';

import Outline from '@one-for-all/artery-outline';

function Demo(): JSX.Element {
  const [rootNode, setNode] = useState(artery.node);
  const [activeNode, setActiveNode] = useState<Node>();

  return (
    <Outline
      rootNode={rootNode}
      activeNode={activeNode}
      onActiveNodeChange={setActiveNode}
      onChange={setNode}
      isContainer={(primaryNode) => {
        if (primaryNode.type === 'html-element') {
          return primaryNode.name === 'div';
        }

        return false;
      }}
    />
  );
}

ReactDOM.render(<Demo />, document.getElementById('root'));
