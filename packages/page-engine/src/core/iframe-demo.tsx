import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

function IframeDemo(): JSX.Element {
  useEffect(() => {
    const myIframe = document.getElementById('myIframe') as HTMLIFrameElement;
    const elementSchema: any = React.createElement(
      'div',
      null,
      'Hello World',
    );
    const BodyElement: any = myIframe.contentDocument?.body as Element;
    const appElement: HTMLDivElement = document.createElement('div');
    appElement.setAttribute('id', 'App');
    ReactDOM.render(elementSchema, appElement);
    BodyElement.appendChild(appElement);
  }, []);
  return (
    <iframe
      id="myIframe"
      name="SimulatorRenderer"
      style={{ transform: 'scale(1)', height: '100%', width: '100%' }}
      // src='https://blog.csdn.net/weixin_30335379/article/details/112542837'
    >
    </iframe>
  );
}

export default IframeDemo;
