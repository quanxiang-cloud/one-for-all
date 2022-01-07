import React, { useEffect } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { configure } from 'mobx';

import Toolbar from './toolbar';
import SourcePanel from './source-panel';
import SettingPanel from './setting-panel';
import Page from '../core/page';
import Ctx from '../ctx';
import stores from '../stores';
import type { PageNode } from '../types';
import { isDev } from '../utils';

// todo: move mock schema into unit test
// import schemaWithApiState from '../mock-schema/with-api-state';
import schemaWithLoopNode from '../mock-schema/loop-node';

import styles from './index.m.scss';

interface Props {
  onSave: (page_schema: PageNode) => void;
  vdoms?: Record<string, React.ReactNode>; // 委托给外部渲染的vdom节点
  className?: string;
  docLink?: string; // 帮助文档链接
  hideTestPreview?: boolean; // 隐藏测试预览
}

/*
  同一个环境存在多个mobx实例时，如果要共享实例的状态, mobx版本必须相同
  @see https://mobx.js.org/configuration.html#isolateglobalstate-boolean
 */
configure({ isolateGlobalState: true });

function Designer({ className, onSave, docLink, hideTestPreview }: Props): JSX.Element | null {
  const { designer } = stores;

  useEffect(() => {
    Object.assign(stores, {
      onSave,
    });

    if (isDev()) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window._ctx = stores;
    }

    return () => {
      // reset ctx
      Object.entries(stores).forEach(([, store]: [string, any]) => {
        if (typeof store?.reset === 'function') {
          store.reset();
        }
      });
    };
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Ctx.Provider value={stores}>
        <div className={cs(styles.designer, className)}>
          <Toolbar docLink={docLink} hideTestPreview={hideTestPreview} />
          <div className={cs(styles.body, {
            [styles.pinned]: designer.panelOpen && designer.panelPinned,
          })}>
            <SourcePanel />
            <Page
              className={cs('my-8', styles.canvas)}
              schema={schemaWithLoopNode as any}
            />
            <SettingPanel />
          </div>
        </div>
      </Ctx.Provider>
    </DndProvider>
  );
}

export default observer(Designer);
