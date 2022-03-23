
import React from 'react';
import ReactDOM from 'react-dom';

import Notice from './notice'
import Notification, { add } from './notification';

interface ToastApi {
  show: (info: ToastProps) => void
}

let element = document.querySelector('#ofa-message-wrap');

if (!element) {
  element = document.createElement('div');
  element.id = 'ofa-message-wrap';
  document.body.append(element);
}

ReactDOM.render(<Notification />, element);

const getUuid = (): string => `MESSAGE${Date.now()}`;

function show(info: ToastProps) {
  add({ id: getUuid(), ...info });
}

const toastApi: ToastApi = { show };

export default toastApi;

export { Notification, Notice }
