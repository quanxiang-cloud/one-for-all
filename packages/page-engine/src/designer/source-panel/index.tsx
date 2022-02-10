import React, { useCallback, useEffect, useRef } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { debounce } from 'lodash';

import { Panel } from '@one-for-all/ui';
import { useCtx } from '../../index';

import Group from './group';
import { groups, panelTitle } from './config';
import PlatformComps from './platform-comps';
// import CustomTemplate from './custom-template'
import PageTree from './page-tree';
import DataSource from './data-source';

import styles from './index.m.scss';

function SourcePanel(): JSX.Element {
  const { designer: store } = useCtx();
  const { activeGroup, panelPinned, panelOpen } = store;
  const panelRef = useRef<HTMLDivElement>(null);
  const hoverDoc = useCallback(debounce(handleClickOutside, 100), []);
  const hoverGroup = useCallback(debounce((name: string)=> {
    store.setActiveGroup(name);
    store.setPanelOpen(true);
  }, 200), []);

  useEffect(() => {
    document.addEventListener('click', hoverDoc);
    return () => {
      document.removeEventListener('click', hoverDoc);
    };
  }, []);

  function handleClickOutside(ev: any): void {
    if (!panelRef.current?.contains(ev.target) && !store.panelPinned) {
      store.setPanelOpen(false);
    }
  }

  function renderPanelCont(): JSX.Element | null {
    if (store.activeGroup === 'comps') {
      return <PlatformComps />;
    }
    // if (store.activeGroup === 'templates') {
    //   return <CustomTemplate />;
    // }
    if (store.activeGroup === 'page_tree') {
      return <PageTree />;
    }
    if (store.activeGroup === 'data_source') {
      return <DataSource />;
    }
    return null;
  }

  return (
    <div className='flex relative' ref={panelRef}>
      <div className={cs(styles.sourcePanel, 'flex flex-col items-center relative')}>
        {groups.map((gp) => {
          return (
            <Group
              {...gp}
              key={gp.name}
              active={activeGroup === gp.name}
              onHover={() => hoverGroup(gp.name)}
            />
          );
        })}
      </div>
      <Panel
        title={panelTitle[activeGroup]}
        style={{ transform: 'translateX(55px)' }}
        onClose={() => store.setPanelOpen(false)}
        onPin={() => store.setPanelPinned(!panelPinned)}
        visible={panelOpen}
        pinned={panelPinned}
        closable
        pinnable
      >
        {renderPanelCont()}
      </Panel>
    </div>

  );
}

export default observer(SourcePanel);
