import React, { CSSProperties, useCallback, useContext, useMemo } from 'react';

import { useObservable } from '../../hooks';
import { set as setSchema } from '../../stores/schema';
import { getContext as getEngineStoreContext } from '../../stores/engine';

// eslint-disable-next-line @rushstack/no-new-null
export default function Block<T extends PageEngineV2.BaseBlocksCommunicationState>(props: PageEngineV2.BlockProps<T>): JSX.Element | null {
  const { gridColumnStart, gridColumnEnd, gridRowStart, gridRowEnd, render: Render, engineId } = props;
  const EngineStoreContext = useMemo(() => getEngineStoreContext<T>(engineId), [engineId]);
  const engineStore$ = useContext(EngineStoreContext);
  const { schemaStore$, blocksCommunicationState$ } = useObservable<PageEngineV2.EngineState<T>>(engineStore$, {
    schemaStore$: engineStore$.value.schemaStore$,
  });
  const schema = useObservable<PageEngineV2.Schema | undefined>(schemaStore$, undefined);

  const style: CSSProperties = {
    gridColumnStart,
    gridColumnEnd,
    gridRowStart,
    gridRowEnd,
  }

  const handleSchemaChange = useCallback((schema: SchemaSpec.Schema): void => {
    setSchema(schemaStore$, schema);
  }, [schemaStore$, schema]);

  if (!schema || !blocksCommunicationState$) {
    return null;
  }

  return (
    <div className="page-engine-layer-block" style={style}>
      <Render schema={schema} onChange={handleSchemaChange} blocksCommunicationState$={blocksCommunicationState$} engineId={engineId} />
    </div>
  )
}
