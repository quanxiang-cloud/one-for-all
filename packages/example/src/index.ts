import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';
import { worker } from './mocks/browser';

import { toAST } from '@one-for-all/scss-wizard';
import scss from './demo';

// worker.start({ serviceWorker: { url: '/mockServiceWorker.js' } });
worker.start();
const appRoot = document.querySelector('#root');

if (!appRoot) {
  throw new Error('appRoot is null, can not render app.');
}

ReactDOM.render(React.createElement(App), appRoot);

toAST(scss).then((ast) => {
  console.log(ast)
})
