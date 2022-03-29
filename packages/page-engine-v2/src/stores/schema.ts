import { BehaviorSubject } from 'rxjs';
import type { Schema } from '@one-for-all/schema-spec';

export function create(schema: Schema): BehaviorSubject<Schema> {
  return new BehaviorSubject<Schema>(schema);
}

export function set(store$: BehaviorSubject<Schema> | undefined, schema: Schema): void {
  store$?.next(schema);
}
