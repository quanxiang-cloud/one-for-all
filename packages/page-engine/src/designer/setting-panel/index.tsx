import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';

import { Tab } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';

import StylePanel from './style-panel';
import EventPanel from './event-panel';
import RendererPanel from './renderer-panel';
import ModalBindState from './modal-bind-state';

import styles from './index.m.scss';

function SettingPanel(): JSX.Element {
  const { page, designer, registry } = useCtx();
  const getAvailablePanels = useCallback(()=> {
    const panels = [
      {
        id: 'props',
        name: '属性',
        content: renderPropsPanel(),
      },
      {
        id: 'style',
        name: '样式',
        content: <StylePanel />,
      },
    ];

    if (page.activeElem?.exportName === 'page') {
      return panels;
    }

    return panels.concat([
      {
        id: 'event',
        name: '事件',
        content: <EventPanel />,
      },
      {
        id: 'renderer',
        name: '动态渲染',
        content: <RendererPanel />,
      },
    ]);
  }, [page.activeElem]);

  useEffect(()=> {
    if (page.activeElem?.exportName === 'page' && !['props', 'style'].includes(designer.activePanel)) {
      // reset to default panel
      designer.setActivePanel('props');
    }
  }, [page.activeElemId]);

  function renderPropsPanel(): JSX.Element {
    const elem = registry.getElemByType(page.activeElem.exportName);
    const ConfigForm = elem.configForm;

    return (
      <div>
        <ConfigForm />
      </div>
    );
  }

  function renderCont(): JSX.Element {
    if (!page.activeElem) {
      return (
        <div className='flex justify-center items-center flex-col h-full'>
          <p>当前层级没有内容</p>
          <p>请在左侧画布选中其他元素</p>
        </div>
      );
    }

    return (
      <>
        <div className={styles.curElem}>
          <span className='mr-8'>{page.activeElem.label} ID: </span>
          <span>{page.activeElem.id}</span>
        </div>
        <Tab
          className={styles.tabs}
          contentClassName={styles.tabCont}
          items={getAvailablePanels()}
          currentKey={designer.activePanel}
          onChange={designer.setActivePanel}
        />
      </>
    );
  }

  return (
    <div className={styles.panel}>
      {renderCont()}
      {designer.modalBindStateOpen && <ModalBindState />}
    </div>
  );
}

export default observer(SettingPanel);
