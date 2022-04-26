import { BehaviorSubject } from 'rxjs';
import type { Artery } from '@one-for-all/artery';

export function create(artery: Artery): BehaviorSubject<Artery> {
  return new BehaviorSubject<Artery>(artery);
}

export function set(store$: BehaviorSubject<Artery> | undefined, artery: Artery): void {
  store$?.next(artery);
}
