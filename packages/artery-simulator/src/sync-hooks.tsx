import React, { useEffect, useRef } from 'react';
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
  messenger: Messenger | undefined,
  isNodeInModalLayer: (node: NodePrimary) => Promise<boolean>,
  isNodeSupportChildren: (node: NodePrimary) => Promise<boolean>,
) {
  useEffect(() => {
    if (!messenger) {
      return;
    }

    messenger.addResponders({
      [MESSAGE_TYPE_CHECK_NODE_IS_MODAL_ROOT]: isNodeInModalLayer,
      [MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN]: isNodeSupportChildren,
    });
  }, [isNodeInModalLayer, isNodeSupportChildren, messenger]);
}

export function useSyncActiveModalLayer(
  messenger: Messenger | undefined,
  setActiveModalLayer: (activeModalLayer?: string | undefined) => void,
  activeModalLayer: string | undefined,
) {
  useEffect(() => {
    if (!messenger) {
      return;
    }

    const subscription = messenger
      .listen(MESSAGE_TYPE_ACTIVE_MODAL_LAYER)
      .subscribe((activeModalRootID) => {
        setActiveModalLayer(activeModalRootID as string);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [setActiveModalLayer, messenger]);

  useEffect(() => {
    if (!messenger) {
      return;
    }

    messenger.send(MESSAGE_TYPE_ACTIVE_MODAL_LAYER, activeModalLayer);
  }, [activeModalLayer, messenger]);
}

export function useSyncActiveNode(
  messenger: Messenger | undefined,
  setActiveNode: (node?: Node | undefined) => void,
  activeNode: Node | undefined,
) {
  const activeNodeID = useRef<string>();

  useEffect(() => {
    if (!messenger) {
      return;
    }

    const subscription = messenger.listen(MESSAGE_TYPE_ACTIVE_NODE).subscribe((_activeNode) => {
      setActiveNode(_activeNode as Node);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setActiveNode, messenger]);

  useEffect(() => {
    if (!messenger) {
      return;
    }
    if (activeNodeID.current !== activeNode?.id) {
      messenger.send(MESSAGE_TYPE_ACTIVE_NODE, activeNode);
      activeNodeID.current = activeNode?.id;
    }
  }, [activeNode, messenger]);
}

export function useSyncArtery(
  messenger: Messenger | undefined,
  onChange: (artery: Artery) => void,
  artery: Artery,
) {
  useEffect(() => {
    if (!messenger) {
      return;
    }

    const subscription = messenger.listen(MESSAGE_TYPE_ARTERY).subscribe((_artery) => {
      onChange(_artery as Artery);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [onChange, messenger]);

  useEffect(() => {
    if (!messenger) {
      return;
    }

    messenger.send(MESSAGE_TYPE_ARTERY, artery);
  }, [artery, messenger]);
}
