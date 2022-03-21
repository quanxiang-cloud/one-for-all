import { customAlphabet } from 'nanoid';
import React, { useEffect } from 'react';
import RenderEngine from '@one-for-all/render-engine';
import { HTMLNode, ReactComponentNode, LoopContainerNode, RouteNode, Schema, SchemaNode } from '@one-for-all/schema-spec';
import { over, lensPath, clone } from 'ramda';

export const uuid = customAlphabet('1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM', 8);

export interface LoadPackcageProps {
  packageName: string;
  packageVersion: string;
  exportName: string;
}
export async function loadPackage<T>({ packageName, packageVersion, exportName }: LoadPackcageProps, defaultValue: T): Promise<T> {
  try {
    const packagePath = packageVersion ? `${packageName}@${packageVersion}` : packageName;
    const component = await System.import(packagePath);
    return component[exportName];
  } catch (error) {
    return defaultValue;
  }
}

interface RenderSchemaProps {
  schema: Schema;
  elementId: string;
}
export function RenderSchema({ schema, elementId }: RenderSchemaProps): JSX.Element {
  const renderEngine = new RenderEngine(schema);
  useEffect(() => {
    const el = document.getElementById(elementId);
    if (el) {
      renderEngine.render(el).catch(() => {});
    }
  }, []);

  return (
    <div id={elementId} style={{display: 'unset'}} />
  )
}

export interface SchemaComponent {
  id: string;
  name?: string;
  label?: string;
  // eslint-disable-next-line
  Preview?: (...args: any[]) => JSX.Element | null;
  // eslint-disable-next-line
  Render?: (...args: any[]) => JSX.Element | null;
}
export async function loadComponentsFromSchema(schema: Schema): Promise<SchemaComponent[]> {
  const nodes: SchemaNode[] = [];
  traverseSchema(schema, node => nodes.push(node));

  const componentsInPromise = nodes.map(async node => {
    const id = `${node.id}`;
    if (node.type === 'react-component') {
      // eslint-disable-next-line
      const Render = await loadPackage<(...args: any[]) => JSX.Element | null>(node, () => null);
      return { id, Render }
    }
    return false;
    // return { id, Render: () => <RenderSchema schema={{...schema, node}} elementId={id} /> }
  }).filter(Boolean) as Promise<SchemaComponent>[];

  return await Promise.all(componentsInPromise);
}

export interface TraverseSchemaOption {
  level: number;
  parentNode?: SchemaNode;
  path?: string;
}
export type OnTraverse = (node: SchemaNode, { level, parentNode, path }: TraverseSchemaOption) => void;
export function traverseSchema(
  schema: Schema,
  callback: OnTraverse,
  level = 0,
  parent?: SchemaNode,
  path?: string,
): void {
  const { node } = schema
  callback(node, { level, parentNode: parent, path: path ?? 'node' });
  if (schemaNodeWithChildren(node)) {
    node.children?.forEach((child, index) => {
      traverseSchema({ node: child }, callback, level + 1, node, `${path ?? 'node'}.children.${index}`)
    });
  }
  if (schemaNodeWithNode(node) && node.node.type !== 'composed-node') {
    traverseSchema({ node: node.node }, callback, level + 1, node, `${path ?? 'node'}.node`)
  }
}

export function getNodeParentPathFromSchemaByNodeId(schema: Schema, nodeID: string): string | undefined {
  let nodePath: string | undefined
  traverseSchema(schema, (node, { path }) => {
    if (node.id === nodeID) {
      nodePath = path;
    }
  })

  return nodePath ? nodePath.split('.').slice(0, -1).join('.') : undefined;
}

export function removeNodeFromSchemaByNodeId(schema: Schema, nodeID: string): Schema {
  const nodeParentPath = getNodeParentPathFromSchemaByNodeId(schema, nodeID);
  if (nodeParentPath) {
    return over(
      lensPath(nodeParentPath.split('.')),
      children => children.filter((child: SchemaNode) => child.id !== nodeID),
      schema
    );
  }
  return schema;
}

export function schemaNodeWithChildren(node: SchemaNode): node is (HTMLNode | ReactComponentNode) {
  return node.type === 'html-element' || node.type === 'react-component';
}

export function schemaNodeWithNode(node: SchemaNode): node is (RouteNode | LoopContainerNode) {
  return node.type === 'loop-container' || node.type === 'route-node';
}

export function removeAllNodeFromSchema(schema: Schema): Schema {
  const nodeIDs: string[] = [];
  traverseSchema(schema, (node, { level, parentNode, path }) => {
    if (parentNode && schemaNodeWithChildren(parentNode)) {
      nodeIDs.push(`${node.id}`);
    }
  });
  return nodeIDs.reduce((schemaAcc, nodeID) => removeNodeFromSchemaByNodeId(schemaAcc, nodeID), schema);
}

export function getActiveSchemaNodeById(schema: Schema, activeNodeID: string): SchemaNode | undefined {
  let activeElem: SchemaNode | undefined;
  traverseSchema(schema, (node) => {
    if (node.id === activeNodeID) {
      activeElem = node;
    }
  });
  return activeElem;
}

export function updateSchemaByNodeId(
  schema: Schema, activeNodeID: string, transformer: (s: SchemaNode) => SchemaNode,
): Schema {
  const sc = clone(schema);
  traverseSchema(sc, (node) => {
    if (node.id === activeNodeID) {
      transformer(node);
    }
  });
  return sc;
}
