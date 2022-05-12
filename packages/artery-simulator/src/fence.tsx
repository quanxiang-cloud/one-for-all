import React, { useState, useEffect } from 'react';
import cs from 'classnames';

export type InjectElement = {
  name: string;
  attrs: Record<string, string>;
  innerText?: string;
};

function toHTML(elements: InjectElement[]): string {
  const template = document.createElement('div');

  elements.forEach((element) => {
    const n = document.createElement(element.name);
    Object.entries(element.attrs).forEach(([key, value]) => {
      n.setAttribute(key, value);
    });

    if (element.innerText) {
      n.innerHTML = element.innerText;
    }

    template.appendChild(n);
  });

  return template.innerHTML;
}

function injectHTML(
  iframe: HTMLIFrameElement,
  headElements: Array<InjectElement>,
  onLoad?: () => void,
): void {
  // todo fixme
  // @ts-ignore
  iframe.contentWindow.CONFIG = window.CONFIG;

  if (iframe.contentWindow) {
    // @ts-ignore
    iframe.contentWindow.__fenceIframeLoad = () => {
      onLoad?.();
    };
  }
  iframe.contentDocument?.open();
  iframe.contentDocument?.write(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script>
      window.onload = (event) => {
        if (window.__fenceIframeLoad) {
          window.__fenceIframeLoad();
        }
      };
    </script>
    ${toHTML(headElements)}
  </head>
  <body>
  </body>
  </html>
  `);

  iframe.contentDocument?.close();
}

interface Props {
  headElements: Array<InjectElement>;
  className?: string;
  onLoad?: () => void;
}

function Fence(
  { headElements, className, onLoad }: Props,
  ref: React.ForwardedRef<HTMLIFrameElement>,
): JSX.Element {
  const [iframeElement, setIframe] = useState<HTMLIFrameElement>();

  useEffect(() => {
    if (!iframeElement) {
      return;
    }

    injectHTML(iframeElement, headElements, onLoad);
  }, [iframeElement]);

  return (
    <iframe
      className={cs('simulator-fence', className)}
      style={{ border: 'none' }}
      ref={(_ref) => {
        // todo fix this
        if (!_ref) {
          return;
        }
        if (typeof ref === 'function') {
          ref(_ref);
        } else if (ref && 'current' in ref) {
          ref.current = _ref;
        }

        setIframe(_ref);
      }}
    />
  );
}

export default React.forwardRef<HTMLIFrameElement, Props>(Fence);
