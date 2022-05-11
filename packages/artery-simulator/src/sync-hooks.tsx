import React, { useEffect } from 'react';
import Messenger from './messenger';
import {
  MESSAGE_TYPE_ARTERY,
  MESSAGE_TYPE_ACTIVE_NODE,
  MESSAGE_TYPE_ACTIVE_MODAL_LAYER,
  MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN,
  MESSAGE_TYPE_CHECK_NODE_IS_MODAL_ROOT,
} from './simulator/constants';
import { Artery, Node } from '@one-for-all/artery';
import { NodePrimary } from './types';

export function useSyncResponders(
  messengerRef: React.MutableRefObject<Messenger | undefined>,
  isNodeInModalLayer: (node: NodePrimary) => Promise<boolean>,
  isNodeSupportChildren: (node: NodePrimary) => Promise<boolean>,
) {
  useEffect(() => {
    messengerRef.current?.addResponders({
      [MESSAGE_TYPE_CHECK_NODE_IS_MODAL_ROOT]: isNodeInModalLayer,
      [MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN]: isNodeSupportChildren,
    });
  }, [isNodeInModalLayer, isNodeSupportChildren]);
}

export function useSyncActiveModalLayer(
  messengerRef: React.MutableRefObject<Messenger | undefined>,
  setActiveModalLayer: (activeModalLayer?: string | undefined) => void,
  activeModalLayer: string | undefined,
) {
  useEffect(() => {
    if (!messengerRef.current) {
      return;
    }

    const subscription = messengerRef.current
      .listen(MESSAGE_TYPE_ACTIVE_MODAL_LAYER)
      .subscribe((activeModalRootID) => {
        setActiveModalLayer(activeModalRootID as string);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [setActiveModalLayer]);

  useEffect(() => {
    messengerRef.current?.send(MESSAGE_TYPE_ACTIVE_MODAL_LAYER, activeModalLayer);
  }, [activeModalLayer]);
}

export function useSyncActiveNode(
  messengerRef: React.MutableRefObject<Messenger | undefined>,
  setActiveNode: (node?: Node | undefined) => void,
  activeNode: Node | undefined,
) {
  useEffect(() => {
    if (!messengerRef.current) {
      return;
    }

    const subscription = messengerRef.current.listen(MESSAGE_TYPE_ACTIVE_NODE).subscribe((_activeNode) => {
      setActiveNode(_activeNode as Node);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setActiveNode]);

  useEffect(() => {
    messengerRef.current?.send(MESSAGE_TYPE_ACTIVE_NODE, activeNode);
  }, [activeNode]);
}

export function useSyncArtery(
  messengerRef: React.MutableRefObject<Messenger | undefined>,
  onChange: (artery: Artery) => void,
  artery: Artery,
) {
  useEffect(() => {
    if (!messengerRef.current) {
      return;
    }

    const subscription = messengerRef.current.listen(MESSAGE_TYPE_ARTERY).subscribe((_artery) => {
      onChange(_artery as Artery);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [onChange]);

  useEffect(() => {
    messengerRef.current?.send(MESSAGE_TYPE_ARTERY, artery);
  }, [artery]);
}
