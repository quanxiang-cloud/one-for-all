import React, { useEffect, useState } from 'react';
import { logger } from '@ofa/utils';

import useInstantiateProps from './use-instantiate-props';
import { importComponent } from './repository';
import type { CTX, DynamicComponent, InstantiatedNode, Repository } from './types';

function useNodeComponent(
  node: InstantiatedNode,
  repository?: Repository,
): DynamicComponent | string | undefined {
  const isRawHTMLElement = node.type === 'html-element';
  const [lazyLoadedComponent, setComponent] = useState<DynamicComponent | undefined>();

  useEffect(() => {
    if (isRawHTMLElement) {
      return;
    }
    // todo refactor this
    const packageNameVersion = `${node.packageName}@${node.packageVersion}`;
    if (repository?.[packageNameVersion]?.[node.exportName || 'default']) {
      setComponent(() => repository?.[packageNameVersion]?.[node.exportName || 'default']);
      return;
    }

    importComponent({
      packageName: node.packageName,
      version: node.packageVersion,
      exportName: node.exportName,
    }).then((comp) => {
      if (!comp) {
        logger.error(
          `got empty component for package: ${node.packageName},`,
          `exportName: ${node.exportName}, version: ${node.packageVersion}`,
        );
        return;
      }

      setComponent(() => comp);
    });
  }, []);

  if (isRawHTMLElement) {
    return node.name;
  }

  return lazyLoadedComponent;
}

type ChildrenRenderProps = {
  nodes: InstantiatedNode[];
  ctx: CTX;
}

function ChildrenRender({ nodes, ctx }: ChildrenRenderProps): React.FunctionComponentElement<any> | null {
  if (!nodes.length) {
    return null;
  }

  return React.createElement(
    React.Fragment,
    null,
    nodes.map((node) => React.createElement(NodeRender, { key: node.key, node: node, ctx })),
  );
}

type Props = {
  node: InstantiatedNode;
  ctx: CTX;
}

function NodeRender({ node, ctx }: Props): React.ReactElement | null {
  const props = useInstantiateProps(node, ctx);
  const nodeComponent = useNodeComponent(node, ctx.repository);

  if (!nodeComponent) {
    return null;
  }

  if (!node.children || !node.children.length) {
    return (React.createElement(nodeComponent, props));
  }

  return (
    React.createElement(
      nodeComponent,
      props,
      React.createElement(ChildrenRender, { nodes: node.children || [], ctx }),
    )
  );
}

export default NodeRender;
