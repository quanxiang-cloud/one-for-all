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

export class Fence {
  public iframe: HTMLIFrameElement;

  public constructor(container: HTMLElement, iframeProps?: Record<string, string>) {
    this.iframe = document.createElement('iframe');
    // todo only allow whitelist property
    Object.entries(iframeProps || {}).forEach(([qualifiedName, value]) => {
      this.iframe.setAttribute(qualifiedName, value);
    });

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
    </head>
    <body>

    </body>
    </html>
    `);

    this.iframe.contentDocument?.close();

    container.appendChild(this.iframe);
  }

  public addElement(htmlStr: string): void {
    const template: HTMLTemplateElement = document.createElement('template');
    template.innerHTML = htmlStr.trim();

    Array.from(template.content.childNodes).forEach((n) => {
      this.iframe.contentDocument?.body.appendChild(n);
    });
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
