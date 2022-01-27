import { PageNode, PageSchema } from '@ofa/page-engine';
import { toJS } from 'mobx';

import { elemId } from '../utils';

export function deepMergeNode(node: PageNode): PageNode {
  const target = toJS(node);
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

  const childrenLength = children?.length || 0;
  let newChildren: PageNode[] = [...(children || [])];

  if (childrenLength > scaleArray.length) {
    newChildren = newChildren.slice(0, scaleArray.length);
  }

  if (childrenLength < scaleArray.length) {
    const _array: PageNode[] = [];
    for (let i = 0; i < (scaleArray.length - childrenLength); (i = i + 1)) {
      _array.push({
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
              gridArea: 'span 1 / span 1 / auto / auto',
              minWidth: 'auto',
            },
          },
        },
        children: [],
      });
    }

    newChildren = newChildren.concat(_array);
  }

  newChildren = newChildren.map((child, index) => {
    const scale = Number(scaleArray[index]) >= 12 ? 12 : Number(scaleArray[index]);
    child.props.style.value = {
      ...(child.props.style.value || {}),
      gridArea: `span 1 / span ${scale === 0 ? 1 : scale } / auto / auto`,
    };
    return child;
  });

  target.children = newChildren;

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
