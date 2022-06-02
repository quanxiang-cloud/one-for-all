import {
  IndividualLoopContainer, ComposedNodeLoopContainer,
  HTMLNode, ReactComponentNode, LinkNode, RefNode, JSXNode, RouteNode
} from '@one-for-all/artery';
import { customAlphabet } from 'nanoid';

export const uuid = customAlphabet('1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM', 10);

export function generateNodeId(prefix?: string): string {
  return `${prefix || ''}${uuid()}`;
}

export type BuildHTMLNodeParams = Omit<HTMLNode, 'id' | 'type'>;
export function buildHTMLNode(params: BuildHTMLNodeParams): HTMLNode {
  return {
    id: generateNodeId(`${params.name}-`),
    type: 'html-element',
    ...params,
  };
}

export type BuildLinkNodeParams = Omit<LinkNode, 'id' | 'type' | 'name' | 'isLink'>;
export function buildLinkNode(params: BuildLinkNodeParams): LinkNode {
  return {
    id: generateNodeId('link-'),
    type: 'html-element',
    name: 'a',
    isLink: true,
    ...params,
  }
}

export type BuildReactComponentNodeParams = Omit<ReactComponentNode, 'id' | 'type'>;
export function buildReactComponentNode(params: BuildReactComponentNodeParams): ReactComponentNode {
  return {
    id: generateNodeId('rc-'),
    type: 'react-component',
    ...params,
  }
}

export type BuildIndividualLoopContainerParams = Omit<IndividualLoopContainer, 'id' | 'type'>;
export function buildIndividualLoopContainerNode(params: BuildIndividualLoopContainerParams): IndividualLoopContainer {
  return {
    id: generateNodeId('individual-loop-container-'),
    type: 'loop-container',
    ...params,
  }
}

export type BuildComposedNodeLoopContainerParams = Omit<ComposedNodeLoopContainer, 'id' | 'type'>;
export function buildComposedNodeLoopContainerNode(params: BuildComposedNodeLoopContainerParams): ComposedNodeLoopContainer {
  return {
    id: generateNodeId('composedNode-loop-container-'),
    type: 'loop-container',
    ...params,
  }
}

export type BuildRefNodeParams = Omit<RefNode, 'id' | 'type'>;
export function buildRefNode(params: BuildRefNodeParams): RefNode {
  return {
    id: generateNodeId('ref-'),
    type: 'ref-node',
    ...params,
  }
}

export type BuildJSXNodeParams = Omit<JSXNode, 'id' | 'type'>
export function buildJSXNode(params: BuildJSXNodeParams): JSXNode {
  return {
    id: generateNodeId('jsx-'),
    type: 'jsx-node',
    ...params,
  }
}

export type BuildRouteNodeParams = Omit<RouteNode, 'id' | 'type'>;
export function buildRouteNode(params: BuildRouteNodeParams): RouteNode {
  return {
    id: generateNodeId('route-'),
    type: 'route-node',
    ...params,
  }
}

function buildBlockId<T>(block: ArteryEngine.Block<T>): void {
  if (!block.id) {
    block.id = generateNodeId('block-');
  }
}

export function buildeLayerId<T>(layer: ArteryEngine.Layer<T>): ArteryEngine.Layer<T> {
  if (!layer.id) {
    layer.id = generateNodeId('layer-');
  }
  layer.blocks.forEach(buildBlockId);
  return layer;
}
