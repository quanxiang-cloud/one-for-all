import React, { useEffect, useRef } from 'react';
import type { Artery, Node } from '@one-for-all/artery';

import simulatorDDL from 'dll:../dll/simulator.js';
import Fence, { InjectElement } from './fence';
import Messenger from './messenger';

import { NodePrimary } from './types';
import { useSyncResponders, useSyncArtery, useSyncActiveNode, useSyncActiveModalLayer } from './sync-hooks';
import { MESSAGE_TYPE_ARTERY } from './simulator/constants';
import { useState } from 'react';

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

  return importMaps.concat([
    // todo fix me
    {
      name: 'script',
      attrs: { type: 'systemjs-importmap' },
      innerText: `{
        "imports": {
          "TEMPORARY_PATCH_FOR_ARTERY_PLUGINS": "${window.origin}${pluginsSrc}"
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

interface Props {
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
  isNodeInModalLayer: (node: NodePrimary) => Promise<boolean>;
}

function Simulator({
  activeModalLayer,
  activeNode,
  artery,
  className,
  isNodeInModalLayer,
  isNodeSupportChildren,
  onChange,
  pluginsSrc,
  setActiveModalLayer,
  setActiveNode,
}: Props): JSX.Element {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [messenger, setMessenger] = useState<Messenger>();
  const [iframeLoad, setIframeLoad] = useState(false);

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

  useSyncResponders(messenger, isNodeInModalLayer, isNodeSupportChildren);
  useSyncArtery(messenger, onChange, artery);
  useSyncActiveNode(messenger, setActiveNode, activeNode);
  useSyncActiveModalLayer(messenger, setActiveModalLayer, activeModalLayer);

  return (
    <Fence
      ref={iframeRef}
      className={className}
      headElements={buildHeadElements(pluginsSrc)}
      onLoad={() => setIframeLoad(true)}
    />
  );
}

export default Simulator;
