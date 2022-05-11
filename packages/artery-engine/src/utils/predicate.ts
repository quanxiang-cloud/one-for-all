import { has, propEq, is } from 'ramda';
import {
  LoopContainerNode, Node, IndividualLoopContainer, ComposedNodeLoopContainer, ComposedNodeChild,
  HTMLNode, ReactComponentNode, LinkNode, RefNode, JSXNode, RouteNode,
} from '@one-for-all/artery';

export function isArteryNode(node: unknown): node is Node {
  return has('id', node);
}

export function isLoopContainerNode(node: Node): node is LoopContainerNode {
  return node.type === 'loop-container';
}

export function isIndividualLoopContainer(node: Node): node is IndividualLoopContainer {
  return isLoopContainerNode(node) && has('toProps', node);
}

export function isComposedNodeLoopContainerNode(node: Node): node is ComposedNodeLoopContainer {
  return isLoopContainerNode(node) && node.node.type === 'composed-node';
}

export function isComposedNodeChildNode(node: Node): node is ComposedNodeChild {
  return has('toProps', node);
}

export function isNodeHasToProps(node: Node): node is IndividualLoopContainer | ComposedNodeChild {
  return isIndividualLoopContainer(node) || isComposedNodeChildNode(node);
}

export function isHTMLNode(node: Node): node is HTMLNode {
  return node.type === 'html-element';
}

export function isLinkNode(node: Node): node is LinkNode {
  return isHTMLNode(node) && propEq('isLink', true, node as LinkNode);
}

export function isReactComponentNode(node: Node): node is ReactComponentNode {
  return node.type === 'react-component';
}

export function isNodeAcceptChild(node: Node): node is HTMLNode | ReactComponentNode {
  return isHTMLNode(node) || isReactComponentNode(node);
}

export function isReactComponentNodeWithExportName(node: Node, exportName: string): node is ReactComponentNode {
  return isReactComponentNode(node) && node.exportName === exportName;
}

export function isRefNode(node: Node): node is RefNode {
  return node.type === 'ref-node';
}

export function isJSXNode(node: Node): node is JSXNode {
  return node.type === 'jsx-node';
}

export function isRouteNode(node: Node): node is RouteNode {
  return node.type === 'route-node';
}

export function isHasSubNode(node: Node): node is RouteNode | LoopContainerNode {
  return isLoopContainerNode(node) || isRouteNode(node)
}

export const isObject = is(Object);
