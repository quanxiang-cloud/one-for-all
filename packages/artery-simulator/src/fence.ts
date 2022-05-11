enum Message {
  internal = 'internal',
  custom = 'custom',
}

declare global {
  interface FENCE {
    sendMessageToParent: (message: any) => void;
    addMessageListener: (listener: (message: any) => void) => void;
  }
}

export default class Fence {
  public iframe: HTMLIFrameElement;

  public constructor(iframe: HTMLIFrameElement, entry: string) {
    this.iframe = iframe;

    this.iframe.contentDocument?.open();
    this.iframe.contentDocument?.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <script>
        function sendMessageToParent(message) {
          window.postMessage({ type: 'custom', message })
        }

        function addMessageListener(listener) {
          window.addEventListener('message', (e) => {
            if (e.data && Reflect.get(e.data, 'type') === 'custom') {
              listener(e.data.message);
            }
          })
        }

        window.FENCE = { sendMessageToParent, addMessageListener }
      </script>
      <script type="systemjs-importmap">
      {
        "imports": {
          "react": "https://ofapkg.pek3b.qingstor.com/react@17.0.1/react.17.0.1.js",
          "react-dom": "https://ofapkg.pek3b.qingstor.com/react-dom@17.0.1/react-dom.17.0.1.js",
          "rxjs/ajax": "https://ofapkg.pek3b.qingstor.com/@ofa/rxjs@7.4.0/rxjs-ajax.min.js",
          "rxjs/fetch": "https://ofapkg.pek3b.qingstor.com/@ofa/rxjs@7.4.0/rxjs-fetch.min.js",
          "rxjs/operators": "https://ofapkg.pek3b.qingstor.com/@ofa/rxjs@7.4.0/rxjs-operators.min.js",
          "rxjs/shared": "https://ofapkg.pek3b.qingstor.com/@ofa/rxjs@7.4.0/rxjs-shared.min.js",
          "rxjs/testing": "https://ofapkg.pek3b.qingstor.com/@ofa/rxjs@7.4.0/rxjs-testing.min.js",
          "rxjs/websocket": "https://ofapkg.pek3b.qingstor.com/@ofa/rxjs@7.4.0/rxjs-websocket.min.js",
          "rxjs": "https://ofapkg.pek3b.qingstor.com/@ofa/rxjs@7.4.0/rxjs.min.js",
          "history": "https://ofapkg.pek3b.qingstor.com/@one-for-all/history@5.3.0/index.min.js",
          "lodash": "https://unpkg.com/lodash@4.17.21/lodash.js",
          "react-jsx-parser": "https://ofapkg.pek3b.qingstor.com/@one-for-all/react-jsx-parser@1.29.0/index.min.js"
        }
      }
    </script>
    <script type="systemjs-importmap">
      {
        "imports": {
          "@one-for-all/api-spec-adapter": "https://ofapkg.pek3b.qingstor.com/@one-for-all/api-spec-adapter@latest/index.min.js",
          "@one-for-all/artery-renderer": "/pkg/artery-renderer/dist/@one-for-all/artery-renderer@latest/index.js",
          "@one-for-all/artery-simulator": "/pkg/artery-simulator/dist/@one-for-all/artery-simulator@latest/index.js",
          "@one-for-all/artery-engine": "/pkg/artery-engine/dist/@one-for-all/artery-engine@latest/index.js",
          "@one-for-all/artery-utils": "/pkg/artery-utils/dist/@one-for-all/artery-utils@latest/index.js",
          "@one-for-all/elements-radar": "/pkg/elements-radar/dist/@one-for-all/elements-radar@latest/index.js",
          "@one-for-all/headless-ui": "/pkg/headless-ui/dist/@one-for-all/headless-ui@latest/web.js",
          "@one-for-all/headless-ui/components-interface.json": "/pkg/headless-ui/dist/@one-for-all/headless-ui@latest/components-interface.json",
          "@one-for-all/icon": "/pkg/icon/dist/@one-for-all/icon@latest/index.js",
          "@one-for-all/scss-forming": "/pkg/scss-forming/dist/@one-for-all/scss-forming@latest/index.js",
          "@one-for-all/style-guide": "/pkg/style-guide/dist/@one-for-all/style-guide@0.1.5/index.js",
          "@one-for-all/ui": "/pkg/ui/dist/@one-for-all/ui@latest/index.min.js",
          "@one-for-all/utils": "/pkg/utils/dist/@one-for-all/utils@latest/index.min.js",
          "csslint": "/pkg/style-guide/dist/@one-for-all/style-guide@0.1.5/csslint.js"
        }
      }
    </script>
    <script src="https://ofapkg.pek3b.qingstor.com/system@6.10.3/system.6.10.3.min.js"></script>
    </head>
    <body>
    <script src="${entry}"></script>
    </body>
    </html>
    `);

    this.iframe.contentDocument?.close();
  }

  public addElement(htmlStr: string): void {
    const template: HTMLTemplateElement | undefined = this.iframe.contentDocument?.createElement('template');
    if (!template) {
      console.error('failed to create template');
      return;
    }
    template.innerHTML = htmlStr.trim();

    Array.from(template.content.childNodes).forEach((n) => {
      this.iframe.contentDocument?.body.appendChild(n);
    });
  }

  public addScript(src: string): void {
    const doc = this.iframe.contentDocument;
    if (!doc) {
      console.error('no contentDocument available');
      return;
    }
    const script = doc.createElement('script');
    script.type = 'systemjs-module';
    script.src = src;
    doc.body.appendChild(script);
  }

  public addMessageListener(listener: (message: any) => void): void {
    this.iframe.contentWindow?.addEventListener('message', (e) => {
      if (e.data && Reflect.get(e.data, 'type') === Message.custom) {
        listener(e.data.message);
      }
    });
  }

  public postMessage(message: any): void {
    this.iframe.contentWindow?.postMessage({ type: Message.custom, message });
  }
}
