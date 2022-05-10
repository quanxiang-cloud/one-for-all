import ReactDOM from 'react-dom';
import React from 'react';
import { RecoilRoot } from 'recoil';

import Simulator, { Props } from './simulator';

export * from '../types';
export * from '../simulator/constants';

function App(props: Props): JSX.Element {
  return (
    <RecoilRoot>
      <Simulator {...props} />
    </RecoilRoot>
  );
};

// artery: Artery;
// setActiveNode: (node?: Node) => void;
// onChange: (artery: Artery) => void;
// activeNode?: Node;
// // modal layer root node id
// activeModalLayer?: string;
// setActiveModalLayer: (activeModalLayer: string) => void;

// plugins?: Plugins;
// className?: string;
// genNodeID: () => string;
// isNodeSupportChildren: (node: NodePrimary) => Promise<boolean>;
// isNodeInModalLayer: (node: NodePrimary) => Promise<boolean>;

const frameSideBridge = {

}

const iframeAppRoot = document.createElement('div');
iframeAppRoot.id = 'iframe-app-root';
document.body.appendChild(iframeAppRoot);

ReactDOM.render(<App />, iframeAppRoot);
