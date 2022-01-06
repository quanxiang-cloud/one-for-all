import React, { useState } from 'react';
import { observer } from 'mobx-react';

import { useCtx } from '@ofa/page-engine';
import { RadioButtonGroup } from '@ofa/ui';

import TreeView from './tree-view';

import styles from './index.m.scss';

type Mode='tree' | 'code' | string

function PageTree(): JSX.Element {
  const { page } = useCtx();
  const [mode, setMode] = useState<Mode>('tree');

  return (
    <div className={styles.pageTree}>
      <RadioButtonGroup
        listData={[
          { label: '大纲视图', value: 'tree' },
          { label: '源码视图', value: 'code' },
        ]}
        onChange={(mode)=> setMode(mode as string)}
        currentValue={mode}
      />
      {mode === 'tree' && (
        <TreeView />
      )}
      {mode === 'code' && (
        <pre className='mt-8'>
          {page.schema ? JSON.stringify(page.schema, null, 2) : <p>暂无数据</p>}
        </pre>
      )}
    </div>
  );
}

export default observer(PageTree);
