import { Schema } from '@one-for-all/schema-spec';
import type { BehaviorSubject } from 'rxjs';

import useObservable from './use-observable';

export default function useSchema(store$: BehaviorSubject<Schema>, defaultSchema: Schema): Schema {
  return useObservable<Schema>(store$, defaultSchema);
}
