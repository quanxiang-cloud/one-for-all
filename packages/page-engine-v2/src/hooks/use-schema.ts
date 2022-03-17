import SchemaSpec from '@one-for-all/schema-spec';
import type { BehaviorSubject } from 'rxjs';

import useObservable from './use-observable';

export default function useSchema(store$: BehaviorSubject<SchemaSpec.Schema>, defaultSchema: SchemaSpec.Schema): SchemaSpec.Schema {
  return useObservable<SchemaSpec.Schema>(store$, defaultSchema);
}
