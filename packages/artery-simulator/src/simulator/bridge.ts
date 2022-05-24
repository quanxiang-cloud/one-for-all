import { distinctUntilChanged, noop } from 'rxjs';
import type { Artery, Node } from '@one-for-all/artery';

import Messenger from '../messenger';
import { NodePrimary } from '../types';
import { activeNode$, activeOverLayerNodeID$, artery$, dropResult$ } from './states-center';
import {
  MESSAGE_TYPE_ARTERY,
  MESSAGE_TYPE_ACTIVE_NODE,
  MESSAGE_TYPE_ACTIVE_OVER_LAYER_NODE_ID,
  MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN,
} from './constants';

export const messenger = new Messenger(window.parent, 'iframe-side');

messenger
  .waitForReady()
  .then(() => {})
  .catch(noop);

messenger.listen<Artery>(MESSAGE_TYPE_ARTERY).subscribe(artery$);

messenger
  .listen<Node | undefined>(MESSAGE_TYPE_ACTIVE_NODE)
  .pipe(distinctUntilChanged((previous, current) => previous?.id === current?.id))
  .subscribe(activeNode$);

messenger
  .listen<string | undefined>(MESSAGE_TYPE_ACTIVE_OVER_LAYER_NODE_ID)
  .subscribe(activeOverLayerNodeID$);

export function setActiveNode(node?: Node): void {
  messenger.send(MESSAGE_TYPE_ACTIVE_NODE, node);
}

export function setActiveModalLayer(nodeID: string | undefined): void {
  messenger.send(MESSAGE_TYPE_ACTIVE_OVER_LAYER_NODE_ID, nodeID);
}

export function onChangeArtery(artery: Artery): void {
  messenger.send(MESSAGE_TYPE_ARTERY, artery);
}

export function checkNodeSupportChildren(node: NodePrimary): Promise<boolean> {
  return messenger.request<NodePrimary, boolean>(MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN, node);
}

dropResult$.subscribe((node) => {
  onChangeArtery({ ...artery$.value, node: node as unknown as Node });
});
