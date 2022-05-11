import React, { useEffect, useMemo, useRef } from 'react';

import simulatorDDL from 'dll:../dll/simulator.js';
import Fence from './fence';
import Messenger from './messenger';
import { Artery, Node } from '@one-for-all/artery';

import { NodePrimary } from './types';
import { useSyncResponders, useSyncArtery, useSyncActiveNode, useSyncActiveModalLayer } from './sync-hooks';

interface Props {
  artery: Artery;
  setActiveNode: (node?: Node) => void;
  onChange: (artery: Artery) => void;
  activeNode?: Node;
  // modal layer root node id
  activeModalLayer?: string;
  setActiveModalLayer: (activeModalLayer?: string) => void;

  // todo plugin url
  plugins?: string;
  className?: string;
  isNodeSupportChildren: (node: NodePrimary) => Promise<boolean>;
  isNodeInModalLayer: (node: NodePrimary) => Promise<boolean>;
}

function Simulator({
  artery,
  onChange,
  activeNode,
  setActiveNode,
  activeModalLayer,
  setActiveModalLayer,
  isNodeSupportChildren,
  isNodeInModalLayer,
  className,
}: Props): JSX.Element {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const messengerRef = useRef<Messenger>();

  useEffect(() => {
    if (!iframeRef.current) {
      return;
    }

    new Fence(iframeRef.current, simulatorDDL);
  }, []);

  useEffect(() => {
    if (!iframeRef.current?.contentWindow) {
      return;
    }

    const messenger = new Messenger(iframeRef.current.contentWindow);
    messenger._connect().then(() => {});

    messengerRef.current = messenger;
  }, []);

  useSyncResponders(messengerRef, isNodeInModalLayer, isNodeSupportChildren);
  useSyncArtery(messengerRef, onChange, artery);
  useSyncActiveNode(messengerRef, setActiveNode, activeNode);
  useSyncActiveModalLayer(messengerRef, setActiveModalLayer, activeModalLayer);

  return (
    <iframe className={className} ref={iframeRef}></iframe>
  );
}

export default Simulator;
