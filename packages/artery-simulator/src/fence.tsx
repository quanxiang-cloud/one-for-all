import React, { useState, useEffect } from 'react';

export type InjectElement = {
  name: string;
  attrs: Record<string, string>;
  innerText?: string;
}

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

function injectHTML(iframe: HTMLIFrameElement, headElements: Array<InjectElement>, onLoad?: () => void): void {
  console.log('inject html')
  if (iframe.contentWindow) {
    // @ts-ignore
    iframe.contentWindow.__fenceIframeLoad = () => {
      onLoad?.();
    }
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

function Fence({ headElements, className, onLoad }: Props, ref: React.ForwardedRef<HTMLIFrameElement>): JSX.Element {
  const [iframeElement, setIframe] = useState<HTMLIFrameElement>();

  useEffect(() => {
    if (!iframeElement) {
      return;
    }

    injectHTML(iframeElement, headElements, onLoad);
  }, [iframeElement])

  return (
    <iframe
      className={className}
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

        setIframe(_ref)
      }}
    />
  )
}

export default React.forwardRef<HTMLIFrameElement, Props>(Fence);

// class Fence2 {
//   public iframe: HTMLIFrameElement;

//   public constructor(iframe: HTMLIFrameElement, headElements: Array<InjectElement>) {
//     this.iframe = iframe;

//     this.iframe.contentDocument?.open();
//     this.iframe.contentDocument?.write(`
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta http-equiv="X-UA-Compatible" content="IE=edge">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Document</title>
//       ${toHTML(headElements)}
//     </head>
//     <body>
//     </body>
//     </html>
//     `);

//     this.iframe.contentDocument?.close();
//   }

//   public addElement(htmlStr: string): void {
//     const template: HTMLTemplateElement | undefined = this.iframe.contentDocument?.createElement('template');
//     if (!template) {
//       console.error('failed to create template');
//       return;
//     }
//     template.innerHTML = htmlStr.trim();

//     Array.from(template.content.childNodes).forEach((n) => {
//       this.iframe.contentDocument?.body.appendChild(n);
//     });
//   }

//   public addScript(src: string): void {
//     const doc = this.iframe.contentDocument;
//     if (!doc) {
//       console.error('no contentDocument available');
//       return;
//     }
//     const script = doc.createElement('script');
//     // script.type = 'systemjs-module';
//     script.src = src;
//     doc.body.appendChild(script);
//   }
// }
