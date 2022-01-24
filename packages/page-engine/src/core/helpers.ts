import React from 'react';
import { defaults, flow, get, identity } from 'lodash';

import { LoopNode, PageNode } from '../index';
// import Elem from '../index/core/elem';
// import { toJS } from 'mobx';
import { mapRawProps } from '../utils/schema-adapter';
import registry from '../stores/registry';
import page from '../stores/page';
import { PagePlaceholder, ContainerPlaceholder } from './common-comps';
import { isDev } from '../utils';

// function renderNode(schema: PageNode | LoopNode, level = 0): JSX.Element | null | undefined {
//   if (typeof schema !== 'object' || schema === null) {
//     return null;
//   }
//
//   let node;
//
//   if (schema.type === 'loop-container') {
//     node = (schema as LoopNode).node as PageNode;
//   } else {
//     node = schema;
//   }
//
//   return (
//     <Elem node={node}>
//       {
//         React.createElement(transformType(node), schemaToProps(toJS(node)), ...([].concat(node.children as any))
//           .map((child) => renderNode(child, level + 1)))
//       }
//       </Elem>
//   );
// }

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
