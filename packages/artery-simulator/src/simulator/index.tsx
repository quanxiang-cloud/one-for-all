import ReactDOM from 'react-dom';
import React from 'react';
import { RecoilRoot } from 'recoil';

import Simulator from './simulator';
import {
  onChange,
  setActiveModalLayer,
  setActiveNode,
  useActiveModalLayer,
  useActiveNode,
  useArtery,
  checkNodeSupportChildren,
  checkNodeIsModalRoot,
} from './bridge';

// todo plugin
function App(): JSX.Element {
  const artery = useArtery();
  const activeNode = useActiveNode();
  const activeModalLayer = useActiveModalLayer();

  if (!artery) {
    return <div>waiting...</div>;
  }

  return (
    <RecoilRoot>
      <Simulator
        artery={artery}
        setActiveNode={setActiveNode}
        onChange={onChange}
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
