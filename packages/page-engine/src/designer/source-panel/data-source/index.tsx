import React, { useState, memo } from 'react';
import { loader } from '@monaco-editor/react';

import { Tab } from '@ofa/ui';

import SharedState from './shared-state';
import ApiState from './api-state';
import FormAddSharedVal from './shared-state/form-add-val';

import styles from './index.m.scss';

interface Props {
  className?: string;
}

// @see https://github.com/suren-atoyan/monaco-react/issues/217
loader.config({ paths: { vs: '/dist/monaco-editor/vs' } });

// monaco editor config, disable worker
Object.assign(window, {
  MonacoEnvironment: {
    getWorker: () => null,
  },
});

function DataSource(props: Props): JSX.Element {
  const [formSharedValReady, setReady] = useState(false);

  return (
    <div className={styles.ds}>
      <Tab
        className={styles.tabs}
        contentClassName={styles.tabCont}
        items={[
          {
            id: 'sharedState',
            name: '变量参数',
            content: (<SharedState onMountEditor={()=> setReady(true)}/>),
          },
          {
            id: 'apiState',
            name: 'API',
            content: (<ApiState />),
          },
        ]}
      />
      {formSharedValReady && <FormAddSharedVal />}
    </div>
  );
}

export default memo(DataSource);
