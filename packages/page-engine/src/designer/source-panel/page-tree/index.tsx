import React, { useState } from 'react';
import { observer } from 'mobx-react';

import { useCtx } from '../../../index';
import { RadioButtonGroup } from '@one-for-all/ui';

import TreeView from './tree-view';

import './index.scss';

type Mode='tree' | 'code' | string

function PageTree(): JSX.Element {
  const { page } = useCtx();
  const [mode, setMode] = useState<Mode>('tree');

  return (
    <div className="page-tree grid">
      <RadioButtonGroup
        className='sticky right-0'
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
