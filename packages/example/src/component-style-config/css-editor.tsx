import React, { useState, useEffect } from 'react';
import { Controlled as CodeMirror } from '@leifandersen/react-codemirror2';

import 'csslint';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/css/css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/css-hint';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/lint/css-lint';
import { Button } from '@one-for-all/headless-ui';

type Props = {
  componentName: string;
  statusName: string;
  setCustomCss: (key: string, customCss: string) => void;
  getCompCss: () => string;
};

function CSSEditor({ componentName, statusName, setCustomCss, getCompCss }: Props): JSX.Element {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(getCompCss());
  }, [statusName]);

  function handleSave(): void {
    setCustomCss(`${componentName}.${statusName}`, value);
  }

  return (
    <div>
      <CodeMirror
        value={value}
        options={{
          mode: 'css',
          theme: 'material',
          lineNumbers: true,
          lint: true,
          gutters: ['CodeMirror-lint-markers'],
          extraKeys: {
            Alt: 'autocomplete',
          },
        }}
        onBeforeChange={(_, __, value) => {
          setValue(value);
        }}
      />
      <Button style={{ marginTop: '15px' }} onClick={handleSave}>
        应用
      </Button>
    </div>
  );
}

export default CSSEditor;
