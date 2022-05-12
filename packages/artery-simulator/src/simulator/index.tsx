import ReactDOM from 'react-dom';
import React from 'react';
import { RecoilRoot } from 'recoil';

import Simulator from './simulator';

function App(): JSX.Element {
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
