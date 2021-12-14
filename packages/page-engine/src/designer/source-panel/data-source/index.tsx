import React from 'react';

import { Tab } from '@ofa/ui';

import SharedState from './shared-state';
import ApiState from './api-state';

import styles from './index.m.scss';

interface Props {
  className?: string;
}

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
