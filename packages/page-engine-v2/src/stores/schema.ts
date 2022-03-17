import { BehaviorSubject } from 'rxjs';
import SchemaSpec from '@one-for-all/schema-spec';

export function create(schema: SchemaSpec.Schema): BehaviorSubject<SchemaSpec.Schema> {
  return new BehaviorSubject<SchemaSpec.Schema>(schema);
}

export function set(store$: BehaviorSubject<SchemaSpec.Schema> | undefined, schema: SchemaSpec.Schema): void {
  store$?.next(schema);
}
