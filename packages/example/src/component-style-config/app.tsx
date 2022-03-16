import React, { useState, useMemo } from 'react';
import cs from 'classnames';

import * as componentsMap from '@one-for-all/headless-ui';
// @ts-ignore
import comps from '@one-for-all/headless-ui/components-interface.json';
import CssASTStore, { ComponentSpec } from '@one-for-all/style-guide';
import { Button, Tab } from '@one-for-all/headless-ui';

import PreviewConfigurableComponent from './preview';

import './index.css';

function Application(): JSX.Element {
  const astStore = useMemo(() => new CssASTStore(), []);
  const [currentComp, setCurrentComp] = useState<ComponentSpec | null>(null);

  function handleSave() {
    astStore.getGzipFile().then((cssBlob: Blob | null) => {
      if (!cssBlob) {
        return;
      }

      const a = document.createElement('a');
      a.href = URL.createObjectURL(cssBlob);
      a.download = 'test.css.gz';
      a.click();
    });
  }

  return (
    <div>
      <div style={{ padding: '5px' }}>
        <Button onClick={handleSave}>
          保存
        </Button>
      </div>
      <div
        style={{ gridTemplateColumns: '200px auto 500px' }}
        className='style-config-container'>
        <div className='style-guide-comp-list'>
          {
            comps.map((comp: ComponentSpec) => {
              return (
                <div
                  className={cs(
                    'style-config-comp-box',
                    { 'style-config-comp-active': currentComp?.key === comp.key },
                  )}
                  key={comp.key}
                  onClick={() => setCurrentComp(comp)}
                >
                  {comp.title}
                </div>
              );
            })
          }
        </div>
        {!!currentComp && (
          <PreviewConfigurableComponent
            astStore={astStore}
            componentsMap={componentsMap}
            componentSpec={currentComp}
          />
        )}
      </div>
    </div>

  );
}

export default Application;
