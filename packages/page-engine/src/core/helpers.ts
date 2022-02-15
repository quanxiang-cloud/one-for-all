import React from 'react';
import { defaults, flow, get, identity } from 'lodash';

import { LoopNode, PageNode } from '../index';
import { mapRawProps } from '../utils/schema-adapter';
import registry from '../stores/registry';
import page from '../stores/page';
import { PagePlaceholder, ContainerPlaceholder } from './common-comps';
import { isDev } from '../utils';
import { encode } from "../utils/base64";

export function transformType(schema: PageNode | LoopNode): string | React.ComponentType {
  const { type } = schema;
  if (type === 'react-component') {
    return registry.elementMap?.[schema.exportName]?.component || type;
  }
  if (type === 'loop-container') {
    const nodeType = get(schema, 'node.exportName');
    return registry.elementMap[nodeType]?.component;
  }
  if (type === 'html-element') {
    return schema.name || 'div';
  }
  return 'div';
}

export const schemaToProps = flow([
  // mergeStyle,
  mergeProps,
]);

export function mergeProps(schema: PageNode): Record<string, any> {
  const elemConf = registry.getElemByType(schema.exportName) || {};
  const toProps = elemConf?.toProps || identity;
  const elemProps = defaults({}, mapRawProps(schema.props || {}), elemConf?.defaultConfig);

  // patch certain elem props
  if (schema.type === 'react-component') {
    // add placeholder to page elem
    if (schema.exportName === 'page' && !schema.children?.length) {
      Object.assign(elemProps, { placeholder: React.createElement(PagePlaceholder) });
    }
    // add placeholder to container elem
    if (schema.exportName === 'container' && !schema.children?.length) {
      Object.assign(elemProps, { placeholder: React.createElement(ContainerPlaceholder) });
    }
  }

  return toProps(elemProps);
}

export function loadDevEnvPageSchema() {
  if (isDev()) {
    let storedSchema = localStorage.getItem('page_schema');
    try {
      storedSchema = JSON.parse(storedSchema as any);
    } catch (err) {
      storedSchema = null;
    }
    storedSchema && page.setSchema(storedSchema as any);
  }
}

export function svgPreviewImg(title: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='20'>
    <rect width='100' height='20' fill='#888' opacity='0.5'></rect>
    <text x='10' y='15' style='font-family: Roboto, sans-serif;font-size: 12px; fill: #000; text-align: center'>${title}</text>
    </svg>`;

  return `data:image/svg+xml;base64,${encode(svg)}`;
}
