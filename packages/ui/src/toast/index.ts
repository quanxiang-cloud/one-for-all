import throttle from './decorators/throttle';

interface Options {
  duration?: number;
}

class Toast {
  private duration?: number
  private element: HTMLElement
  private notifyInstances: Element[]

  constructor() {
    this.duration = 3000;
    this.element = document.body;
    this.element.style.position = 'relative';
    this.notifyInstances = [];
    const style = document.createElement('style');
    style.innerHTML = `
      .toast {
        position: absolute;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        padding: 7px 16px;
        box-shadow: 0px 8px 24px 4px rgba(148, 163, 184, 0.25);
        border-radius: 4px 12px 12px 12px;
        transition: all .3s ease;
        animation: show 1s ease forwards;
        z-index: 40;
      }

      @keyframes show {
        0% {
          transform: rotateX(90deg) translateX(-50%);
        }
        100% {
          transform: rotateX(0deg) translateX(-50%);
        }
      }

      .toast .message-info {
        font-size: 14px;
        line-height: 22px;
      }

      .toast .close {
        margin-left: 64px;
        cursor: pointer;
        color: #64748B;
        font-size: 20px;
        display: flex;
        align-items: center;
      }

      .toast.error {
        background: #FEF2F2;
        border: 1px solid #DC2626;
        color: #DC2626;
      }

      .toast.info {
        background: #F0FDF4;;
        border: 1px solid #16A34A;
        color: #16A34A;
      }
    `;
    document.head.appendChild(style);
    // @ts-ignore
    window.closeNotify = this.close;
  }

  public close = (e: Event | HTMLElement) => {
    let curNotifyElement: HTMLElement;
    if (e instanceof Event) {
      const closeElement = e.currentTarget as HTMLElement;
      curNotifyElement = closeElement.parentElement as HTMLElement;
      while (!curNotifyElement.classList.contains('toast')) {
        curNotifyElement = curNotifyElement.parentElement as HTMLElement;
      }
    } else if (e instanceof HTMLElement) {
      curNotifyElement = e;
    } else {
      curNotifyElement = this.notifyInstances[0] as HTMLElement;
    }

    const curNotifyElementIndex = this.notifyInstances.findIndex(
      (element) => element === curNotifyElement,
    );

    const notifyInstances = this.notifyInstances.slice(curNotifyElementIndex + 1) as HTMLElement[];
    this.notifyInstances.splice(curNotifyElementIndex, 1);
    curNotifyElement.parentElement?.removeChild(curNotifyElement);

    notifyInstances.forEach((element) => {
      const top = parseInt(element.style.top);
      if (top - 60 >= 80) {
        element.style.top = `${top - 60}px`;
      }
    });
  }

  public success(message: string | Error | unknown, options?: Options) {
    this.toast('info', message, options);
  }

  public error(message: string | Error | unknown, options?: Options) {
    this.toast('error', message, options);
  }

  setDuration(duration: number) {
    this.duration = duration;
  }

  setRoot(element: HTMLElement) {
    this.element = element;
  }

  private getTemplate(type: string, message: string, closeable: boolean) {
    return `
      <div class='toast ${type}'>
        <span class='message-info'>${message}</span>
        ${closeable ? `
          <span class='close' onClick='closeNotify(event);'>
            <svg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 0 24 24' width='24px' fill='#64748B'><path d='M0 0h24v24H0z' fill='none'/><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>
          </span>
        ` : ''}
      </div>
    `;
  }

  @throttle(300)
  private toast(type: string, message: string | Error | unknown, options?: Options) {
    let msg = message;
    if (msg instanceof Error) {
      msg = msg.message;
    } else if (typeof msg !== 'string') {
      msg = String(msg);
    }
    this.element.insertAdjacentHTML('beforeend', this.getTemplate(
      type, msg as string, options?.duration === -1,
    ));
    const element = this.element.lastElementChild as HTMLElement;
    if (!element) {
      return;
    }
    if (this.notifyInstances.length) {
      element.style.top = `${(this.notifyInstances.length * 60) + 80}px`;
    }
    this.notifyInstances.push(element);
    if (options?.duration === -1) {
      return;
    }
    setTimeout(() => this.close(element), options?.duration || this.duration);
  }
}

export default new Toast();
