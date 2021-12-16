import React, { useCallback, useEffect, useRef } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { debounce } from 'lodash';

import { Panel } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';

import Group from './group';
import { groups, panelTitle } from './config';
import PlatformComps from './platform-comps';
import PageTree from './page-tree';
// import CustomTemplate from './custom-template';
import DataSource from './data-source';

import styles from './index.m.scss';

function SourcePanel(): JSX.Element {
  const store = useCtx().designer;
  const { activeGroup, panelPinned, panelOpen } = store;
  const panelRef = useRef<HTMLDivElement>(null);
  const hoverDoc = useCallback(debounce(handleClickOutside, 200), []);
  const hoverGroup = useCallback(debounce((name: string)=> {
    store.setActiveGroup(name);
    store.setPanelOpen(true);
  }, 200), []);

  useEffect(() => {
    document.addEventListener('mouseover', hoverDoc);
    return () => {
      document.removeEventListener('mouseover', hoverDoc);
    };
  }, []);

  function handleClickOutside(ev: any): void {
    if (!panelRef.current?.contains(ev.target) && !store.panelPinned) {
      store.setPanelOpen(false);
    }
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
        visible={panelOpen && activeGroup === 'comps'}
        pinned={panelPinned}
        closable
        pinnable
      >
        <PlatformComps />
      </Panel>
      <Panel
        title={panelTitle[activeGroup]}
        style={{ transform: 'translateX(55px)' }}
        onClose={() => store.setPanelOpen(false)}
        onPin={() => store.setPanelPinned(!panelPinned)}
        visible={panelOpen && activeGroup === 'page_tree'}
        pinned={panelPinned}
        closable
        pinnable
      >
        <PageTree />
      </Panel>
      <Panel
        title={panelTitle[activeGroup]}
        style={{ transform: 'translateX(55px)' }}
        onClose={() => store.setPanelOpen(false)}
        onPin={() => store.setPanelPinned(!panelPinned)}
        visible={panelOpen && activeGroup === 'data_source'}
        pinned={panelPinned}
        closable
        pinnable
      >
        <DataSource />
      </Panel>
    </div>

  );
}

export default observer(SourcePanel);