import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Toolbar from './toolbar';
import SourcePanel from './source-panel';
import SettingPanel from './setting-panel';
import Page from '../core/page';

import Ctx from '../ctx';
import stores from '../stores';

import styles from './index.m.scss';

interface Props {
  className?: string;
}

function Designer({ className }: Props): JSX.Element | null {
  const { designer } = stores;

  useEffect(() => {
    return () => {
      Object.entries(stores).forEach(([, store]) => {
        if (typeof store.reset === 'function') {
          store.reset();
        }
      });
    };
  }, []);

  return (
    <Ctx.Provider value={stores}>
      <div className={cs(styles.designer, className)}>
        <Toolbar />
        <DndProvider backend={HTML5Backend}>
          <div className={cs(styles.body, {
            [styles.pinned]: designer.panelOpen && designer.panelPinned,
          })}>
            <SourcePanel />
            <Page className={cs('my-8', styles.canvas)} />
            <SettingPanel />
          </div>
        </DndProvider>
      </div>
    </Ctx.Provider>
  );
}

export default observer(Designer);
