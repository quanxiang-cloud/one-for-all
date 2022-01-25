import { PageNode, PageSchema } from '../index';
import { toJS } from 'mobx';

import { elemId } from '../utils';

export function deepMergeNode(node: PageNode): PageNode {
  const target = toJS(node);
  // support loop-container
  if (target.type === 'loop-container') {
    Object.assign(target, { id: elemId('loop-node') });

    if (target.node) {
      // composed-node
      if (target.node.type === 'composed-node') {
        Object.assign(target.node, { id: elemId('composed-node') });
        if (target.node.outLayer) {
          target.node.outLayer = deepMergeNode(target.node.outLayer);
        }

        if (target.node.children) {
          target.node.children = target.node.children.map(deepMergeNode);
        }

        return target;
      }

      target.node = deepMergeNode(target.node);
    }

    return target;
  }

  Object.assign(target, { id: elemId(node.exportName) });
  if (target.children) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    target.children = target.children.map(deepMergeNode);
  }
  return target;
}

export function generateGridChildren(
  node: Omit<PageNode, 'type'| 'id'>,
  parentId: string,
  conf?: any,
): Omit<PageNode, 'type'| 'id'> {
  const target = node;
  const { defaultConfig, children } = target;
  const { colRatio = '12' } = conf || defaultConfig;
  const scaleArray: string[] = colRatio.split(':');
  if (children?.length === scaleArray.length) {
    return target;
  }

  const _children: any[] = [];
  scaleArray.map((item) => {
    _children.push({
      id: elemId('container'),
      pid: parentId,
      type: 'react-component',
      exportName: 'container',
      packageName: 'ofa-ui',
      packageVersion: 'latest',
      label: '布局',
      props: {
        style: {
          type: 'constant_property',
          value: {
            display: 'flex',
            flexFlow: 'column nowrap',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            gridArea: `span 1 / span ${item} / auto / auto`,
            minWidth: 'auto',
          },
        },
      },
      children: [],
    });
  });

  target.children = _children;

  return target;
}

export function initPageSchema(): PageSchema {
  return {
    node: {
      id: elemId('page'),
      pid: '',
      type: 'react-component',
      packageName: 'ofa-ui',
      packageVersion: 'latest',
      exportName: 'page',
      label: '页面',
      props: {
        style: {
          type: 'constant_property',
          value: {
            width: '100%',
            height: '100%',
          },
        },
      },
      children: [],
    },
    apiStateSpec: {},
    sharedStatesSpec: {},
  };
}
