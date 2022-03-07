import React, { useState } from 'react';
import { observer } from 'mobx-react';

import { RadioButtonGroup } from '@one-for-all/ui';

import { useCtx } from '../../../index';
import TreeView from './tree-view';

import './index.scss';

type Mode = 'tree' | 'code' | string

function PageTree(): JSX.Element {
  const { page } = useCtx();
  const [mode, setMode] = useState<Mode>('tree');

  // fixme: `gap-10` not work in projects with two tailwind config
  return (
    <div className="w-full h-full flex flex-col items-center overflow-hidden relative page-tree">
      <RadioButtonGroup
        listData={[
          { label: '大纲视图', value: 'tree' },
          { label: '源码视图', value: 'code' },
        ]}
        onChange={(mode) => setMode(mode as string)}
        currentValue={mode}
      />
      <div className="grid w-full overflow-x-auto relative flex-1 mt-10">
        {mode === 'tree' && (<TreeView />)}
        {mode === 'code' && (
          <pre className='mt-8'>
            {page.schema ? JSON.stringify(page.schema, null, 2) : <p>暂无数据</p>}
          </pre>
        )}
      </div>
    </div>
  );
}

export default observer(PageTree);
