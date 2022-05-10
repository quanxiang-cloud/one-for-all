import { Artery, Node } from '@one-for-all/artery';
import { useEffect, useState } from 'react';

import Messenger from '../messenger';
import { NodePrimary } from '../types';
import {
  MESSAGE_TYPE_ARTERY,
  MESSAGE_TYPE_ACTIVE_NODE,
  MESSAGE_TYPE_ACTIVE_MODAL_LAYER,
  MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN,
  MESSAGE_TYPE_CHECK_NODE_IS_MODAL_ROOT,
} from './constants';

export const messenger = new Messenger(window, {});

export function useArtery(): Artery | undefined {
  const [artery, setArtery] = useState<Artery>();
  useEffect(() => {
    messenger.listen<Artery>(MESSAGE_TYPE_ARTERY).subscribe(setArtery);
  }, []);

  return artery;
}

export function useActiveNode(): Node | undefined {
  const [activeNode, setActiveNode] = useState<Node>();
  useEffect(() => {
    messenger.listen<Node | undefined>(MESSAGE_TYPE_ACTIVE_NODE).subscribe(setActiveNode);
  }, []);

  return activeNode;
}

export function useActiveModalLayer(): string | undefined {
  const [modalRootID, setModalRootID] = useState<string>();
  useEffect(() => {
    messenger.listen<string | undefined>(MESSAGE_TYPE_ACTIVE_MODAL_LAYER).subscribe(setModalRootID);
  }, []);

  return modalRootID;
}

export function setActiveNode(node?: Node): void {
  messenger.send({ type: MESSAGE_TYPE_ACTIVE_NODE, data: node });
}

export function setActiveModalLayer(nodeID: string | undefined): void {
  messenger.send({ type: MESSAGE_TYPE_ACTIVE_MODAL_LAYER, data: nodeID });
}

export function onChange(artery: Artery): void {
  messenger.send({ type: MESSAGE_TYPE_ARTERY, data: artery });
}

export function checkNodeSupportChildren(node: NodePrimary): Promise<boolean> {
  return messenger
    .request({ type: MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN, data: node })
    .then(({ data }) => data as boolean);
}

export function checkNodeIsModalRoot(node: NodePrimary): Promise<boolean> {
  return messenger
    .request({ type: MESSAGE_TYPE_CHECK_NODE_IS_MODAL_ROOT, data: node })
    .then(({ data }) => data as boolean);
}
