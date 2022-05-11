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
}

type Responder = (data: any) => Promise<any>;

export default class Messenger {
  target: Window;
  receive$: Subject<Frame>;
  send$: Subject<Frame>;
  seq = 0;
  connected = false;

  responderMap: Record<string, Subscription> = {};

  constructor(target: Window) {
    this.target = target;

    this.send$ = new Subject<Frame>();
    this.receive$ = new Subject<Frame>();

    this.target.addEventListener('message', (e) => {
      this.receive$.next(e.data);
    });

    this.send$.subscribe((frame) => {
      this.target.postMessage(frame);
    });
  }

  addResponders(responders: Record<string, Responder>): void {
    Object.entries(responders).forEach(([type, responder]) => {
      const subscription = this.receive$
        .pipe(
          filter((frame) => frame.message.type === type),
          switchMap(({ message, seq }) => from(Promise.all([responder(message.data), Promise.resolve(seq)]))),
          map(([response, echoSeq]) => ({
            message: { type: `echo_${type}`, data: response },
            echoSeq,
            seq: this.nextSeq(),
          })),
        )
        .subscribe(this.send$);

      if (this.responderMap[type]) {
        this.responderMap[type].unsubscribe();
      }

      this.responderMap[type] = subscription;
    });
  }

  _connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('messenger connection timeout'));
      }, 60 * 1000);

      const subscription = interval(500)
        .pipe(
          tap(() => {
            this.send('ping', 'ping');
          }),
          takeUntil(this.listen('ping')),
        )
        .subscribe({
          complete: () => {
            subscription.unsubscribe();
            clearTimeout(timer);
            this.connected = true;
            resolve();
          },
        });
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
    });
  }

  listen<T>(type: string): Observable<T> {
    return this.receive$.pipe(
      filter((frame) => frame.message.type === type),
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

    this.send$.next({ message: { type, data }, seq });

    return wait;
  }
}
