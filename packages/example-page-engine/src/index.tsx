import React from 'react';
import { render } from 'react-dom';

import { Designer } from '@ofa/page-engine';
import { toast } from '@ofa/ui';

function App(): JSX.Element {
  function onSave(page_schema: any): void {
    localStorage.setItem('page_schema', JSON.stringify(page_schema));
    toast.success('保存成功');
  }

  function onPreview(page_schema: any): void {
    console.log('preview page: ', page_schema);
  }

  return (
    <Designer
      onSave={onSave}
      onPreview={onPreview}
    />
  );
}

render(<App />, document.getElementById('app'));
