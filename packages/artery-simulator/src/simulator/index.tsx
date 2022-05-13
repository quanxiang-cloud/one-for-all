import ReactDOM from 'react-dom';
import React from 'react';
import { RecoilRoot } from 'recoil';

import Simulator from './simulator';
import { useArteryRootNodeID } from './utils';
import { dummy_artery_root_node_id } from './bridge';

function App(): JSX.Element | null {
  const rootNodeID =  useArteryRootNodeID();
  if (rootNodeID === dummy_artery_root_node_id) {
    return null;
  }

  return (
    <RecoilRoot>
      <Simulator />
    </RecoilRoot>
  );
}

const iframeAppRoot = document.createElement('div');
iframeAppRoot.id = 'iframe-app-root';
document.body.appendChild(iframeAppRoot);

ReactDOM.render(<App />, iframeAppRoot);
