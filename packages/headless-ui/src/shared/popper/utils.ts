import ReactDOM from 'react-dom';

export type removeEventListener = () => void;

export function addEventListener(
  target: Element | Document,
  eventType: keyof DocumentEventMap,
  cb: (a: any) => any,
  option?: boolean | AddEventListenerOptions,
): removeEventListener {
  const callback = ReactDOM.unstable_batchedUpdates ? function run(e: Event) {
    ReactDOM.unstable_batchedUpdates(cb, e);
  } : cb;
  if (target.addEventListener) {
    target.addEventListener(eventType, callback, option);
  }
  return () => {
    if (target.removeEventListener) {
      target.removeEventListener(eventType, callback);
    }
  };
}

