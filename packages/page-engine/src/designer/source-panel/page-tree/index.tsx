import React from 'react';
import { observer } from 'mobx-react';

import { useCtx } from '@ofa/page-engine';

function PageTree(): JSX.Element {
  const store = useCtx().page;

  return (
    <pre>
      {store.schema ? JSON.stringify(store.schema, null, 2) : <p>暂无数据</p>}
    </pre>
  );
}

export default observer(PageTree);
