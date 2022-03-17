import { customAlphabet } from 'nanoid';
import React, { useEffect } from 'react';
import RenderEngine from '@one-for-all/render-engine';
import { HTMLNode, ReactComponentNode, LoopContainerNode, RouteNode } from '@one-for-all/schema-spec';
import { over, lensPath } from 'ramda';

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
  schema: PageEngineV2.Schema;
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
export async function loadComponentsFromSchema(schema: PageEngineV2.Schema): Promise<SchemaComponent[]> {
  const nodes: PageEngineV2.SchemaNode[] = [];
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
  parentNode?: PageEngineV2.SchemaNode;
  path?: string;
}
export type OnTraverse = (node: PageEngineV2.SchemaNode, { level, parentNode, path }: TraverseSchemaOption) => void;
export function traverseSchema(
  schema: PageEngineV2.Schema,
  callback: OnTraverse,
  level = 0,
  parent?: PageEngineV2.SchemaNode,
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

export function getNodeParentPathFromSchemaByNodeId(schema: PageEngineV2.Schema, nodeID: string): string | undefined {
  let nodePath: string | undefined
  traverseSchema(schema, (node, { path }) => {
    if (node.id === nodeID) {
      nodePath = path;
    }
  })

  return nodePath ? nodePath.split('.').slice(0, -1).join('.') : undefined;
}

export function removeNodeFromSchemaByNodeId(schema: PageEngineV2.Schema, nodeID: string): PageEngineV2.Schema {
  const nodeParentPath = getNodeParentPathFromSchemaByNodeId(schema, nodeID);
  if (nodeParentPath) {
    return over(
      lensPath(nodeParentPath.split('.')),
      children => children.filter((child: PageEngineV2.SchemaNode) => child.id !== nodeID),
      schema
    );
  }
  return schema;
}

export function schemaNodeWithChildren(node: PageEngineV2.SchemaNode): node is (HTMLNode | ReactComponentNode) {
  return node.type === 'html-element' || node.type === 'react-component';
}

export function schemaNodeWithNode(node: PageEngineV2.SchemaNode): node is (RouteNode | LoopContainerNode) {
  return node.type === 'loop-container' || node.type === 'route-node';
}

export function removeAllNodeFromSchema(schema: PageEngineV2.Schema): PageEngineV2.Schema {
  const nodeIDs: string[] = [];
  traverseSchema(schema, (node, { level, parentNode, path }) => {
    if (parentNode && schemaNodeWithChildren(parentNode)) {
      nodeIDs.push(`${node.id}`);
    }
  });
  return nodeIDs.reduce((schemaAcc, nodeID) => removeNodeFromSchemaByNodeId(schemaAcc, nodeID), schema);
}
