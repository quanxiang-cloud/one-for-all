import React, { useEffect, useRef } from 'react';

import simulatorDDL from 'dll:../dll/simulator.js';
import Fence from './fence';
import Messenger, { Message } from './messenger';
import {
  MESSAGE_TYPE_ARTERY,
  MESSAGE_TYPE_ACTIVE_NODE,
  MESSAGE_TYPE_ACTIVE_MODAL_LAYER,
  MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN,
  MESSAGE_TYPE_CHECK_NODE_IS_MODAL_ROOT,
} from './simulator/constants';
import { Artery, Node } from '@one-for-all/artery';

import { NodePrimary } from './types';

interface Props {
  artery: Artery;
  setActiveNode: (node?: Node) => void;
  onChange: (artery: Artery) => void;
  activeNode?: Node;
  // modal layer root node id
  activeModalLayer?: string;
  setActiveModalLayer: (activeModalLayer: string) => void;

  // todo plugin url
  plugins?: string;
  className?: string;
  isNodeSupportChildren: (node: NodePrimary) => Promise<boolean>;
  isNodeInModalLayer: (node: NodePrimary) => Promise<boolean>;
}

function Simulator({ artery, onChange, setActiveNode, isNodeSupportChildren }: Props): JSX.Element {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) {
      return;
    }

    const fence = new Fence(iframeRef.current, simulatorDDL);
    if (iframeRef.current.contentWindow) {
      const messenger = new Messenger(iframeRef.current.contentWindow, {
        [MESSAGE_TYPE_CHECK_NODE_IS_MODAL_ROOT]: (
          message: Message<NodePrimary>,
        ): Promise<Message<boolean>> => {
          return Promise.resolve({
            type: MESSAGE_TYPE_CHECK_NODE_IS_MODAL_ROOT,
            data: false,
          });
        },
        [MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN]: (
          message: Message<NodePrimary>,
        ): Promise<Message<boolean>> => {
          return isNodeSupportChildren(message.data).then((flag) => {
            return {
              type: MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN,
              data: flag,
            }
          });
        },
      });

      messenger.listen(MESSAGE_TYPE_ARTERY).subscribe((_artery) => {
        onChange(_artery as Artery);
      });

      messenger.listen(MESSAGE_TYPE_ACTIVE_NODE).subscribe((_activeNode) => {
        setActiveNode(_activeNode as Node);
      });

      messenger._connect().then(() => {});
    }
  }, []);

  return (
    <div>
      <iframe ref={iframeRef}></iframe>
    </div>
  );
}

export default Simulator;
