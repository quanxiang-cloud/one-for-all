import { useState, useEffect } from 'react';
import { Observable } from 'rxjs';

export default function useObservable<T extends unknown>(observable: Observable<T> | undefined, initialValue: T): T {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    if (observable) {
      const subscription = observable.subscribe(setValue);
      return () => subscription.unsubscribe();
    }
  }, [observable]);

  return value ?? initialValue;
}
