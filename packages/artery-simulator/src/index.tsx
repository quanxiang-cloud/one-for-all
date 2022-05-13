import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import type { Artery, Node } from '@one-for-all/artery';

import simulatorDDL from 'dll:../dll/simulator.js';
import Messenger from './messenger';
import Fence, { InjectElement } from './fence';
import { NodePrimary } from './types';
import { useSyncResponders, useSyncArtery, useSyncActiveNode, useSyncActiveModalLayer } from './sync-hooks';
import { MESSAGE_TYPE_ARTERY } from './simulator/constants';

function buildHeadElements(pluginsSrc: string): InjectElement[] {
  const importMaps: InjectElement[] = Array.from(document.scripts)
    .filter((s) => s.type === 'systemjs-importmap')
    .map((s) => JSON.parse(s.innerText))
    .map((s) => JSON.stringify(s))
    .map((s) => ({
      name: 'script',
      attrs: { type: 'systemjs-importmap' },
      innerText: s,
    }));

  const patchSrc = pluginsSrc.startsWith('http') ? pluginsSrc : `${window.origin}${pluginsSrc}`;

  return importMaps.concat([
    // todo fix me
    {
      name: 'script',
      attrs: { type: 'systemjs-importmap' },
      innerText: `{
        "imports": {
          "TEMPORARY_PATCH_FOR_ARTERY_PLUGINS": "${patchSrc}"
        }
      }`,
    },
    {
      name: 'script',
      attrs: { src: 'https://ofapkg.pek3b.qingstor.com/system@6.10.3/system.6.10.3.min.js' },
    },
    {
      name: 'script',
      attrs: { src: simulatorDDL },
    },
  ]);
}

export interface Props {
  artery: Artery;
  setActiveNode: (node?: Node) => void;
  onChange: (artery: Artery) => void;
  activeNode?: Node;
  // modal layer root node id
  activeModalLayer?: string;
  setActiveModalLayer: (activeModalLayer?: string) => void;

  // todo plugin url
  pluginsSrc: string;
  className?: string;
  isNodeSupportChildren: (node: NodePrimary) => Promise<boolean>;
  modalComponents: Array<{ packageName: string; exportName: string; }>;
}

export interface SimulatorRef {
  iframe: HTMLIFrameElement | null;
}

function Simulator({
  activeModalLayer,
  activeNode,
  artery,
  className,
  isNodeSupportChildren,
  modalComponents,
  onChange,
  pluginsSrc,
  setActiveModalLayer,
  setActiveNode,
}: Props, simulatorRef: React.ForwardedRef<SimulatorRef>): JSX.Element {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [messenger, setMessenger] = useState<Messenger>();
  const [iframeLoad, setIframeLoad] = useState(false);

  useImperativeHandle(simulatorRef, () => {
    return { iframe: iframeRef.current || null };
  });

  useEffect(() => {
    if (!iframeRef.current?.contentWindow || !iframeLoad) {
      return;
    }

    const msgr = new Messenger(iframeRef.current?.contentWindow, 'host-side');
    msgr.waitForReady().then(() => {
      msgr.send(MESSAGE_TYPE_ARTERY, artery);
    });

    setMessenger(msgr);
  }, [iframeLoad]);

  useSyncResponders(messenger, isNodeSupportChildren);
  useSyncArtery(messenger, onChange, artery);
  useSyncActiveNode(messenger, setActiveNode, activeNode);
  useSyncActiveModalLayer(messenger, setActiveModalLayer, activeModalLayer);

  return (
    <Fence
      ref={iframeRef}
      className={className}
      headElements={buildHeadElements(pluginsSrc)}
      onLoad={() => setIframeLoad(true)}
      modalComponents={modalComponents}
    />
  );
}

export default React.forwardRef<SimulatorRef, Props>(Simulator);
