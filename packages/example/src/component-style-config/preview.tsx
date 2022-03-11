import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from "react-dom";

import CssASTStore, { ComponentSpec, StyleConfigInterface } from '@one-for-all/style-guide';

import CSSEditor from './css-editor';

type Props = {
  componentSpec: ComponentSpec;
  astStore: CssASTStore;
  componentsMap: Record<string, React.FC>;
}

function applyStyle(compKey: string, css: string, shadowRoot: ShadowRoot): void {
  const styleID = `custom-css-${compKey}`;
  const style = shadowRoot.getElementById(styleID) || document.createElement('style');
  style.innerHTML = '';
  style.setAttribute('id', styleID);
  style.appendChild(document.createTextNode(css));
  shadowRoot.appendChild(style);
}

export function ShadowContent({ shadowRoot, children }: { children: JSX.Element[], shadowRoot: ShadowRoot }) {
  useEffect(() => {
    const style = document.createElement('style');
    const compStyle = document.createElement('link');
    compStyle.href = '/pkg/style-guide/dist/@one-for-all/style-guide@0.0.1/css/web.css';
    compStyle.rel = 'stylesheet';
    style.textContent = `
      .style-config-preview-comp {
        display: flex;
        gap: 5px;
        align-items: center;
        cursor: pointer;
        padding: 5px;
        border: 1px solid transparent;
      }
      .style-config-preview-comp:hover {
        border: 1px solid #638AFF;
      }`;
    shadowRoot.appendChild(compStyle);
    shadowRoot.appendChild(style);
  }, [])

  return ReactDOM.createPortal(children, shadowRoot as unknown as Element);
}

function PreviewConfigurableComponent({ componentSpec, astStore, componentsMap }: Props): JSX.Element {
  const [currentCompStatus, setStatus] = useState<StyleConfigInterface | null>(null);
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot>();
  const previewRef = useRef<HTMLDivElement>(null);
  const { key } = componentSpec;
  const Component = componentsMap[key];

  useEffect(() => {
    if (!previewRef.current || shadowRoot) {
      return;
    }

    setShadowRoot(previewRef.current?.attachShadow({ mode: 'open' }))
  }, [previewRef.current]);

  function setCustomCss(key: string, css: string) {
    if (!currentCompStatus) {
      return;
    }

    astStore.setCss(key, css, currentCompStatus.rules, (msg) => alert(msg));
    const componentName = key.split('.').shift() || "";
    const componentCss = astStore.getComponentCss(componentName, componentSpec.specs)
    shadowRoot && applyStyle(componentName, componentCss, shadowRoot);
  }

  return (
    <>
      <div ref={previewRef} className='style-config-preview'>
        {shadowRoot && (
          <ShadowContent shadowRoot={shadowRoot}>
            {
              componentSpec.specs.map((spec) => {
                return (
                  <div style={{ padding: '5px 0' }} key={spec.title}>
                    <div style={{ marginBottom: '5px' }}>{spec.title}</div>
                    <div
                      onClick={() => setStatus(spec)}
                      className='style-config-preview-comp'
                    >
                      {Array.isArray(spec.componentProps) ? spec.componentProps.map((props) => (
                        <Component key={JSON.stringify(props)} {...props} />
                      )) : (<Component {...spec.componentProps} />)}
                    </div>
                  </div>
                );
              })
            }
          </ShadowContent>
        )}
      </div>
      {currentCompStatus ? (
        <CSSEditor
          getCompCss={() => astStore.getInitCompCss(`${key}.${currentCompStatus.title}`, currentCompStatus.rules)}
          setCustomCss={setCustomCss}
          componentName={key}
          statusName={currentCompStatus.title}
        />
      ) : <div />}
    </>
  );
}

export default PreviewConfigurableComponent;
