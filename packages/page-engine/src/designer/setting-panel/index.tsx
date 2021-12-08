import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { Tab } from '@ofa/ui';
import ctx from '@page-engine/ctx';

import StylePanel from './style-panel';
import EventPanel from './event-panel';
import RendererPanel from './renderer-panel';

import styles from './index.m.scss';

interface Props {
  className?: string;
}

function SettingPanel(props: Props) {
  const { page, designer, registry } = useContext(ctx);

  function renderPropsPanel(): JSX.Element {
    const elem = registry.getElemByType(page.activeElem.comp);
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
          items={[
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
          ]}
          currentKey={designer.activePanel}
          onChange={designer.setActivePanel}
        />
      </>
    );
  }

  return (
    <div className={styles.panel}>
      {renderCont()}
    </div>
  );
}

export default observer(SettingPanel);
