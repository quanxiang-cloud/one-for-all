import ReactDOM from 'react-dom';
import React from 'react';

import Background from './background';
import Foreground from './foreground';
import GreenZone from './green-zone';
import { DUMMY_ARTERY_ROOT_NODE_ID } from './constants';
import { useArteryRootNodeID } from './states-center';

import './index.scss';

function Simulator(): JSX.Element | null {
  const rootNodeID = useArteryRootNodeID();
  if (rootNodeID === DUMMY_ARTERY_ROOT_NODE_ID) {
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
