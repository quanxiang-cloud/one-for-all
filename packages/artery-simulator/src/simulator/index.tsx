import ReactDOM from 'react-dom';
import React from 'react';

import Simulator from './simulator';
import { useArteryRootNodeID } from './utils';
import { dummy_artery_root_node_id } from './states-center';

function App(): JSX.Element | null {
  const rootNodeID = useArteryRootNodeID();
  if (rootNodeID === dummy_artery_root_node_id) {
    return null;
  }

  return <Simulator />;
}

const iframeAppRoot = document.createElement('div');
document.body.appendChild(iframeAppRoot);

ReactDOM.render(<App />, iframeAppRoot);
