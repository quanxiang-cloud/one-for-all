import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import ctx from '../../../ctx';

interface Props {
  className?: string;
}

function PageTree(props: Props) {
  const store = useContext(ctx).page;

  return (
    <pre>
      {store.schema ? JSON.stringify(store.schema, null, 2) : <p>暂无数据</p>}
    </pre>
  );
}

export default observer(PageTree);
