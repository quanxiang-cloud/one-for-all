import React, { useEffect, useRef } from 'react';

import simulatorDDL from 'dll:../dll/simulator.js';
import Fence from './fence';
import Messenger, { Message } from './messenger';
import { MESSAGE_TYPE_ARTERY, MESSAGE_TYPE_CHECK_NODE_IS_MODAL_ROOT, MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN } from './simulator/constants';
import { Artery } from '@one-for-all/artery';

import rootartery from '../../example/src/root-artery';
import { NodePrimary } from './types';

type Props = {
  artery: Artery;
}

function Simulator({ artery }: Props): JSX.Element {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) {
      return;
    }

    const fence = new Fence(iframeRef.current, simulatorDDL);
    if (iframeRef.current.contentWindow) {
      const messenger = new Messenger(iframeRef.current.contentWindow, {
        [MESSAGE_TYPE_CHECK_NODE_IS_MODAL_ROOT]: (message: Message<NodePrimary>): Promise<Message<boolean>> => {
          return Promise.resolve({
            type: MESSAGE_TYPE_CHECK_NODE_IS_MODAL_ROOT,
            data: false,
          });
        },
        [MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN]: (message: Message<NodePrimary>): Promise<Message<boolean>> => {
          return Promise.resolve({
            type: MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN,
            data: true,
          });
        }
      });
      messenger._connect().then(() => {
        messenger.send({
          type: MESSAGE_TYPE_ARTERY,
          data: rootartery
        })
      });
    }
  }, []);

  return (
    <div>
      <iframe ref={iframeRef}></iframe>
    </div>
  );
}

export default Simulator;
