import React from 'react';

import { Tab } from '@one-for-all/ui';

import SharedState from './shared-state';
import ApiState from './api-state';

import styles from './index.m.scss';

interface Props {
  className?: string;
}

// // @see https://github.com/suren-atoyan/monaco-react/issues/217
// loader.config({ paths: { vs: '/dist/monaco-editor/vs' } });
//
// // monaco editor config, disable worker
// Object.assign(window, {
//   MonacoEnvironment: {
//     getWorker: () => null,
//   },
// });

function DataSource(props: Props): JSX.Element {
  return (
    <div className={styles.ds}>
      <Tab
        className={styles.tabs}
        contentClassName={styles.tabCont}
        items={[
          {
            id: 'sharedState',
            name: '变量参数',
            content: (<SharedState />),
          },
          {
            id: 'apiState',
            name: 'API',
            content: (<ApiState />),
          },
        ]}
      />
    </div>
  );
}

export default DataSource;
