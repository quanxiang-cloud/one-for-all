import React from 'react';
import ReactDOM from 'react-dom';

import { logger } from '@ofa/utils';

import {
  importComponent,
  // register,
  // getBasicComponentsOptions,
  // getAdvancedComponentsOptions,
} from './repository';
import {
  DynamicComponent,
  Instantiated,
  InstantiatedSchema,
  SchemaNode,
} from './types';
import APIStateHub from './api-state-hub';
import useConnection from './use-connection';

type RenderNodesProps = {
  nodes: SchemaNode<Instantiated>[];
  apiStateHub: APIStateHub;
}

function renderChildren({ nodes, apiStateHub }: RenderNodesProps): React.FunctionComponentElement<any> | null {
  if (!nodes.length) {
    return null;
  }

  return React.createElement(
    React.Fragment,
    null,
    nodes.map((node) => React.createElement(renderNode, { key: node.key, node: node, apiStateHub })),
  );
}

type RenderNodeProps = {
  node: SchemaNode<Instantiated>
  apiStateHub: APIStateHub;
}

function renderNode({ node, apiStateHub }: RenderNodeProps): React.ReactElement | null {
  const [loaded, setLoaded] = React.useState(false);
  const asyncModule = React.useRef<DynamicComponent | string>();

  const props = useConnection({ nodeProps: node.props || {}, apiStateHub });

  React.useEffect(() => {
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
      React.createElement(renderChildren, { nodes: node.children || [], apiStateHub }),
    )
  );
}

type RenderSchemaParams = {
  schema: InstantiatedSchema;
  rootEle: Element;
  apiStateHub: APIStateHub;
}

function renderSchema({ schema, rootEle, apiStateHub }: RenderSchemaParams): void {
  // register('@basicComponents', getBasicComponentsOptions());
  // register('@advancesComponents', getAdvancedComponentsOptions());

  ReactDOM.render(React.createElement(renderNode, { node: schema.node, apiStateHub }), rootEle);
}

export default renderSchema;
