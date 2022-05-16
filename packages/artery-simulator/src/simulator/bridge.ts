import type { Artery, Node } from '@one-for-all/artery';
import { filter as arteryFilter, byArbitrary, ImmutableNode } from '@one-for-all/artery-utils';
import { fromJS } from 'immutable';
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, Observable } from 'rxjs';

import Messenger from '../messenger';
import { ContourNode, NodePrimary } from '../types';
import { contourNodesReport$ } from './atoms';
import {
  MESSAGE_TYPE_ARTERY,
  MESSAGE_TYPE_ACTIVE_NODE,
  MESSAGE_TYPE_ACTIVE_OVER_LAYER_NODE_ID,
  MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN,
  __OVER_LAYER_COMPONENTS,
} from './constants';

export const messenger = new Messenger(window.parent, 'iframe-side');
messenger.waitForReady().then(() => {});

export const dummy_artery_root_node_id = 'DUMMY_ARTERY_ROOT_NODE_ID';

const dummyArtery: Artery = {
  node: { id: dummy_artery_root_node_id, type: 'html-element', name: 'div' },
};

export const immutableRoot$ = new BehaviorSubject<ImmutableNode>(
  fromJS({ id: 'initial', type: 'html', nam: 'div' }),
);
export const artery$ = new BehaviorSubject<Artery>(dummyArtery);
messenger.listen<Artery>(MESSAGE_TYPE_ARTERY).subscribe(artery$);
artery$.pipe(map<Artery, ImmutableNode>((artery) => fromJS(artery.node))).subscribe(immutableRoot$);

export const rootNodID$: Observable<string> = immutableRoot$.pipe(
  map((node) => node.getIn(['id']) as string),
  distinctUntilChanged(),
);

export const activeNode$ = new BehaviorSubject<Node | undefined>(undefined);
messenger
  .listen<Node | undefined>(MESSAGE_TYPE_ACTIVE_NODE)
  .pipe(distinctUntilChanged((previous, current) => previous?.id === current?.id))
  .subscribe(activeNode$);

export const activeContour$ = new BehaviorSubject<ContourNode | undefined>(undefined);

combineLatest({ activeNode: activeNode$, contourNodesReport: contourNodesReport$ })
  .pipe(
    map(({ activeNode, contourNodesReport }) => {
      return contourNodesReport?.contourNodes.find(({ id }) => id === activeNode?.id);
    }),
    distinctUntilChanged((p, c) => p?.id === c?.id),
  )
  .subscribe(activeContour$);

export const activeContourToolbarStyle$ = new BehaviorSubject<React.CSSProperties | undefined>(undefined);

activeContour$
  .pipe(
    filter((n): n is ContourNode => !!n),
    map(({ absolutePosition, relativeRect }) => {
      const { x, y, height } = absolutePosition;

      if (relativeRect?.y < 40) {
        return {
          transform: `translate(${x + 4}px, ${y + height}px)`,
        };
      }

      return {
        transform: `translate(${x + 4}px, ${y}px)`,
      };
    }),
  )
  .subscribe(activeContourToolbarStyle$);

export const activeOverLayerNodeID$ = new BehaviorSubject<string | undefined>(undefined);
messenger.listen<string | undefined>(MESSAGE_TYPE_ACTIVE_OVER_LAYER_NODE_ID).subscribe(activeOverLayerNodeID$);

export const activeOverLayerArtery$ = new BehaviorSubject<Artery | undefined>(undefined);

activeOverLayerNodeID$.pipe(
  map((activeModalRootID) => {
    if (!activeModalRootID) {
      return undefined;
    }

    const keyPath = byArbitrary(immutableRoot$.value, activeModalRootID);
    if (!keyPath) {
      return undefined;
    }

    const _node = immutableRoot$.value.getIn(keyPath) as ImmutableNode;

    return _node.toJS() as unknown as Node;
  }),
  map((node) => {
    if (!node) {
      return undefined;
    }

    return {
      node,
      apiStateSpec: artery$.value.apiStateSpec,
      sharedStatesSpec: artery$.value.sharedStatesSpec,
    }
  }),
).subscribe(activeOverLayerArtery$);

function findAllOverLayerNodes(rootNode: ImmutableNode): Array<ImmutableNode> {
  const keyPathList = arteryFilter(rootNode, (currentNode) => {
    const nodeType = currentNode.getIn(['type']);
    if (nodeType !== 'react-component') {
      return false;
    }

    const packageName = currentNode.getIn(['packageName']) as string;
    const exportName = currentNode.getIn(['exportName']) as string;

    return !!__OVER_LAYER_COMPONENTS.find((modalComp) => {
      return packageName === modalComp.packageName && exportName === modalComp.exportName;
    });
  });

  if (!keyPathList.size) {
    return [];
  }

  return keyPathList.map<ImmutableNode>((keyPath) => rootNode.getIn(keyPath) as ImmutableNode).toArray();
}

const allModalRootNodes$ = immutableRoot$.pipe(map(findAllOverLayerNodes));

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