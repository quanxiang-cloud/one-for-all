import ReactDOM from 'react-dom';
import React from 'react';
import { RecoilRoot } from 'recoil';

import Simulator from './simulator';
import {
  setActiveModalLayer,
  setActiveNode,
  useActiveModalLayer,
  useActiveNode,
  useArtery,
  checkNodeSupportChildren,
  checkNodeIsModalRoot,
  dummy_artery_root_node_id,
} from './bridge';

// todo plugin
function App(): JSX.Element {
  const artery = useArtery();
  const activeNode = useActiveNode();
  const activeModalLayer = useActiveModalLayer();

  if (artery.node.id === dummy_artery_root_node_id) {
    return <div>waiting...</div>;
  }

  return (
    <RecoilRoot>
      <Simulator
        setActiveNode={setActiveNode}
        activeNode={activeNode}
        activeModalLayer={activeModalLayer}
        setActiveModalLayer={setActiveModalLayer}
        isNodeSupportChildren={checkNodeSupportChildren}
        isNodeInModalLayer={checkNodeIsModalRoot}
      />
    </RecoilRoot>
  );
}
const iframeAppRoot = document.createElement('div');
iframeAppRoot.id = 'iframe-app-root';
document.body.appendChild(iframeAppRoot);
ReactDOM.render(<App />, iframeAppRoot);
