import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { logger } from '@ofa/utils';

import {
  importComponent,
  // register,
  // getBasicComponentsOptions,
  // getAdvancedComponentsOptions,
} from './repository';
import {
  CTX,
  DynamicComponent,
  Instantiated,
  InstantiatedNode,
  SchemaNode,
} from './types';
import useInstantiateProps from './use-instantiate-props';

type RenderNodesProps = {
  nodes: SchemaNode<Instantiated>[];
  ctx: CTX;
}

function renderChildren({ nodes, ctx }: RenderNodesProps): React.FunctionComponentElement<any> | null {
  if (!nodes.length) {
    return null;
  }

  return React.createElement(
    React.Fragment,
    null,
    nodes.map((node) => React.createElement(renderNode, { key: node.key, node: node, ctx })),
  );
}

type RenderNodeProps = {
  node: SchemaNode<Instantiated>;
  ctx: CTX;
}

function renderNode({ node, ctx }: RenderNodeProps): React.ReactElement | null {
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
      React.createElement(renderChildren, { nodes: node.children || [], ctx }),
    )
  );
}

type RenderSchemaParams = {
  node: InstantiatedNode;
  renderRoot: Element;
  ctx: CTX;
}

function renderSchema({ node, renderRoot, ctx }: RenderSchemaParams): void {
  // register('@basicComponents', getBasicComponentsOptions());
  // register('@advancesComponents', getAdvancedComponentsOptions());

  ReactDOM.render(React.createElement(renderNode, { node, ctx }), renderRoot);
}

export default renderSchema;
