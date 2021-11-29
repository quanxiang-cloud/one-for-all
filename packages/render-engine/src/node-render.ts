import { logger } from '@ofa/utils';
import React, { useEffect } from 'react';
import { CTX, DynamicComponent, InstantiatedNode } from '.';
import { importComponent } from './repository';
import useInstantiateProps from './use-instantiate-props';

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
  const [loaded, setLoaded] = React.useState(false);
  const asyncModule = React.useRef<DynamicComponent | string>();
  const props = useInstantiateProps(node, ctx);

  // implement didMountHook and willUnmount here
  // useEffect(() => {
  //   if (loaded) {
  //     setTimeout(() => node.didMount?.call(ctx), 0);
  //   }

  //   return () => node.willUnmount?.call(ctx);
  // }, [loaded]);

  useEffect(() => {
    if (node.type === 'html-element') {
      asyncModule.current = node.name;
      setLoaded(true);
      return;
    }

    importComponent(node.packageName, node.exportName, node.packageVersion).then((comp) => {
      if (!comp) {
        logger.error(
          `got empty component for package: ${node.packageName},`,
          `exportName: ${node.exportName}, version: ${node.packageVersion}`,
        );
      }
      asyncModule.current = comp;
      setLoaded(true);
    });
  }, []);

  if (!loaded || !asyncModule.current) {
    return null;
  }

  if (!node.children || !node.children.length) {
    return (React.createElement(asyncModule.current, props));
  }

  return (
    React.createElement(
      asyncModule.current,
      props,
      React.createElement(ChildrenRender, { nodes: node.children || [], ctx }),
    )
  );
}

export default NodeRender;
