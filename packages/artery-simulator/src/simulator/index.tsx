import ReactDOM from 'react-dom';
import React from 'react';
import { RecoilRoot } from 'recoil';

import Simulator from './simulator';
import { useArtery, dummy_artery_root_node_id } from './bridge';

// todo plugin
function App(): JSX.Element {
  const artery = useArtery();

  if (artery.node.id === dummy_artery_root_node_id) {
    return <div>waiting...</div>;
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
