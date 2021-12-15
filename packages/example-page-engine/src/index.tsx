import React from 'react';
import { render } from 'react-dom';

import { Designer } from '@ofa/page-engine';

function App(): JSX.Element {
  function onSave(page_schema: any): void {
    console.log('save page: ', page_schema);
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
