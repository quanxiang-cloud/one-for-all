import React, { useEffect, useMemo, useRef } from 'react';

import simulatorDDL from 'dll:../dll/simulator.js';
import Fence from './fence';
import Messenger from './messenger';
import { Artery, Node } from '@one-for-all/artery';

import { NodePrimary } from './types';
import { useSyncResponders, useSyncArtery, useSyncActiveNode, useSyncActiveModalLayer } from './sync-hooks';
import { MESSAGE_TYPE_ARTERY } from './simulator/constants';

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
  activeModalLayer,
  activeNode,
  artery,
  className,
  isNodeInModalLayer,
  isNodeSupportChildren,
  onChange,
  plugins,
  setActiveModalLayer,
  setActiveNode,
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

    const messenger = new Messenger(iframeRef.current?.contentWindow, 'host-side');
    messenger.waitForReady().then(() => {
      messengerRef.current?.send(MESSAGE_TYPE_ARTERY, artery);
    });
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
