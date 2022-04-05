import { BehaviorSubject } from 'rxjs';
import type { Artery } from '@one-for-all/artery';

export function create(schema: Artery): BehaviorSubject<Artery> {
  return new BehaviorSubject<Artery>(schema);
}

export function set(store$: BehaviorSubject<Artery> | undefined, schema: Artery): void {
  store$?.next(schema);
}
