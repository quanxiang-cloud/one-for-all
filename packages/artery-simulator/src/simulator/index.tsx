import ReactDOM from 'react-dom';
import React from 'react';

import Background from './background';
import Foreground from './foreground';
import GreenZone from './green-zone';
import { useArteryRootNodeID } from './utils';
import { dummy_artery_root_node_id } from './states-center';

import './index.scss';

function Simulator(): JSX.Element | null {
  const rootNodeID = useArteryRootNodeID();
  if (rootNodeID === dummy_artery_root_node_id) {
    return null;
  }

  return (
    <>
      <Background />
      <GreenZone />
      <Foreground />
    </>
  );
}

const iframeAppRoot = document.createElement('div');
document.body.appendChild(iframeAppRoot);

ReactDOM.render(<Simulator />, iframeAppRoot);
