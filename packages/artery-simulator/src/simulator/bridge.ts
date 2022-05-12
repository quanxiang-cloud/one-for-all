import { Artery, Node } from '@one-for-all/artery';
import { ImmutableNode } from '@one-for-all/artery-utils';
import { fromJS } from 'immutable';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';

import Messenger from '../messenger';
import { NodePrimary } from '../types';
import {
  MESSAGE_TYPE_ARTERY,
  MESSAGE_TYPE_ACTIVE_NODE,
  MESSAGE_TYPE_ACTIVE_MODAL_LAYER,
  MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN,
  MESSAGE_TYPE_CHECK_NODE_IS_MODAL_ROOT,
} from './constants';

export const messenger = new Messenger(window.parent, 'iframe-side');
messenger.waitForReady().then(() => {});

export const dummy_artery_root_node_id = 'DUMMY_ARTERY_ROOT_NODE_ID';

const dummyArtery: Artery = {
  node: { id: dummy_artery_root_node_id, type: 'html-element', name: 'div' },
};

export const immutableRoot$ = new BehaviorSubject<ImmutableNode>(fromJS({ id: 'initial', type: 'html', nam: 'div'}));
export const artery$ = new BehaviorSubject<Artery>(dummyArtery);
messenger.listen<Artery>(MESSAGE_TYPE_ARTERY).subscribe(artery$);
artery$.pipe(map<Artery, ImmutableNode>((artery) => fromJS(artery.node))).subscribe(immutableRoot$);

export const rootNodID$: Observable<string> = immutableRoot$.pipe(
  map((node) => node.getIn(['id']) as string),
  distinctUntilChanged(),
);

export const activeNode$ = new BehaviorSubject<Node | undefined>(undefined);
messenger.listen<Node | undefined>(MESSAGE_TYPE_ACTIVE_NODE).subscribe(activeNode$);

export const activeModalLayer$ = new BehaviorSubject<string | undefined>(undefined);
messenger.listen<string | undefined>(MESSAGE_TYPE_ACTIVE_MODAL_LAYER).subscribe(activeModalLayer$);

export function setActiveNode(node?: Node): void {
  messenger.send(MESSAGE_TYPE_ACTIVE_NODE, node);
}

export function setActiveModalLayer(nodeID: string | undefined): void {
  messenger.send(MESSAGE_TYPE_ACTIVE_MODAL_LAYER, nodeID);
}

export function onChangeArtery(artery: Artery): void {
  messenger.send(MESSAGE_TYPE_ARTERY, artery);
}

export function checkNodeSupportChildren(node: NodePrimary): Promise<boolean> {
  return messenger.request<NodePrimary, boolean>(MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN, node);
}

export function checkNodeIsModalRoot(node: NodePrimary): Promise<boolean> {
  return messenger.request(MESSAGE_TYPE_CHECK_NODE_IS_MODAL_ROOT, node);
}