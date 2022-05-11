import ReactDOM from 'react-dom';
import React from 'react';
import { RecoilRoot } from 'recoil';

import Simulator from './simulator';
import { dummy_artery_root_node_id, artery$ } from './bridge';
import { useBehaviorSubjectState } from './utils';

// todo plugin
function App(): JSX.Element {
  const artery = useBehaviorSubjectState(artery$);

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
