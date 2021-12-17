import React from 'react';
import { render } from 'react-dom';

import { Designer } from '@ofa/page-engine';
import { toast } from '@ofa/ui';

function App(): JSX.Element {
  function onSave(page_schema: any, options?: any): void {
    localStorage.setItem(options?.draft ? 'page_schema_draft' : 'page_schema', JSON.stringify(page_schema));
    toast.success('保存成功');
  }

  return (
    <Designer onSave={onSave} />
  );
}

render(<App />, document.getElementById('app'));
