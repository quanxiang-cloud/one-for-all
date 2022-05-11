import {
  filter,
  find,
  from,
  interval,
  map,
  Observable,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

export interface Message<T = any> {
  type: string;
  data: T;
}

interface Frame {
  message: Message;
  seq: number;
  echoSeq?: number;
  name: string;
}

type Responder = (data: any) => Promise<any>;

export default class Messenger {
  target: Window;
  receive$: Subject<Frame>;
  send$: Subject<Frame>;
  seq = 0;
  connected = false;

  responderMap: Record<string, Subscription> = {};
  name: string;
  isSubWin: boolean;

  constructor(target: Window, name: string) {
    this.target = target;
    this.name = name;

    this.send$ = new Subject<Frame>();
    this.receive$ = new Subject<Frame>();

    if (window === target) {
      throw new Error('Messenger: target can not be same as current window');
    }

    this.isSubWin = window.parent === target;

    window.addEventListener('message', (e) => {
      if (e.origin !== window.origin) {
        return;
      }

      if (this.name === e.data.name) {
        return;
      }

      this.receive$.next(e.data);
    });

    this.send$.subscribe((frame) => {
      this.target.postMessage(frame, window.origin)
    });
  }

  addResponders(responders: Record<string, Responder>): void {
    Object.entries(responders).forEach(([type, responder]) => {
      const subscription = this.receive$
        .pipe(
          filter((frame) => {
            if (frame.message) {
              return frame.message.type === type;
            }

            return false;
          }),
          switchMap(({ message, seq }) => from(Promise.all([responder(message.data), Promise.resolve(seq)]))),
          map(([response, echoSeq]) => ({
            message: { type: `echo_${type}`, data: response },
            echoSeq,
            seq: this.nextSeq(),
            name: this.name,
          })),
        )
        .subscribe(this.send$);

      if (this.responderMap[type]) {
        this.responderMap[type].unsubscribe();
      }

      this.responderMap[type] = subscription;
    });
  }

  waitForReady(): Promise<void> {
    return new Promise((resolve, reject) => {
      let subscription: Subscription | undefined;
      const timer = setTimeout(() => {
        subscription?.unsubscribe();
        reject(new Error('messenger connection timeout'));
      }, 20 * 1000);

      if (this.isSubWin) {
        subscription = interval(200)
          .pipe(
            tap(() => this.send('ping', 'ping')),
            takeUntil(this.listen('ping')),
          )
          .subscribe({
            complete: () => {
              subscription?.unsubscribe();
              clearTimeout(timer);
              this.connected = true;
              resolve();
            },
          });
      } else {
        this.listen('ping').subscribe(() => {
          this.send('ping', 'ping');
          clearTimeout(timer);
          this.connected = true;
          resolve();
        })
      }
    });
  }

  nextSeq(): number {
    this.seq = this.seq + 1;

    return this.seq;
  }

  send(type: string, data: any): void {
    this.send$.next({
      message: { type, data },
      seq: this.nextSeq(),
      name: this.name,
    });
  }

  listen<T>(type: string): Observable<T> {
    return this.receive$.pipe(
      filter((frame) => {
        if (frame.message) {
          return frame.message.type === type;
        }
        return false;
      }),
      map(({ message }) => message.data as T),
    );
  }

  request(type: string, data: any): Promise<any> {
    const seq = this.nextSeq();
    const wait = new Promise<Message>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`messenger request timeout, request message type is: ${type}`));
      }, 10 * 1000);

      const subscription = this.receive$.pipe(find(({ echoSeq }) => echoSeq === seq)).subscribe((frame) => {
        subscription.unsubscribe();
        clearTimeout(timer);

        if (!frame) {
          reject(new Error('fatal'));
          return;
        }

        resolve(frame.message);
      });
    });

    this.send$.next({ message: { type, data }, seq, name: this.name });

    return wait;
  }
}
