import { filter, find, from, interval, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';

export interface Message<T = unknown> {
  type: string;
  data: unknown;
}

interface Frame {
  message: Message;
  seq: number;
  echoSeq?: number;
}

type Responder = (message: Message) => Promise<Message>;

export default class Messenger {
  target: Window;
  receive$: Subject<Frame>;
  send$: Subject<Frame>;
  seq = 0;
  connected = false;

  constructor(target: Window, responders: Record<string, Responder>) {
    this.target = target;

    this.send$ = new Subject<Frame>();
    this.receive$ = new Subject<Frame>();

    this.target.addEventListener('message', (e) => {
      this.receive$.next(e.data);
    });

    this.send$.subscribe((frame) => {
      this.target.postMessage(frame);
    });

    Object.entries(responders).forEach(([type, responder]) => {
      this.receive$
        .pipe(
          filter((frame) => frame.message.type === type),
          switchMap(({ message, seq }) => from(Promise.all([responder(message), Promise.resolve(seq)]))),
          map(([responseMessage, echoSeq]) => ({
            message: responseMessage,
            echoSeq,
            seq: this.nextSeq(),
          })),
        )
        .subscribe(this.send$);
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
            this.send({ type: 'ping', data: 'ping' });
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

  send(message: Message): void {
    this.send$.next({
      message: message,
      seq: this.nextSeq(),
    });
  }

  listen<T>(type: string): Observable<T> {
    return this.receive$.pipe(
      filter((frame) => frame.message.type === type),
      map(({ message }) => message.data as T),
    );
  }

  request(message: Message): Promise<Message> {
    const seq = this.nextSeq();
    const wait = new Promise<Message>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`messenger request timeout, request message type is: ${message.type}`));
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

    this.send$.next({ message: message, seq });

    return wait;
  }
}
