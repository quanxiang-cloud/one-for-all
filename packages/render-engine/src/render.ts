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
import StateHub from './state-hub';
import useConnection from './use-connection';

type RenderNodesProps = {
  nodes: SchemaNode<Instantiated>[];
  stateHub: StateHub;
}

function renderChildren({ nodes, stateHub }: RenderNodesProps): React.FunctionComponentElement<any> | null {
  if (!nodes.length) {
    return null;
  }

  return React.createElement(
    React.Fragment,
    null,
    nodes.map((node) => React.createElement(renderNode, { key: node.key, node: node, stateHub: stateHub })),
  );
}

type RenderNodeProps = {
  node: SchemaNode<Instantiated>
  stateHub: StateHub;
}

function renderNode({ node, stateHub }: RenderNodeProps): React.ReactElement | null {
  const [loaded, setLoaded] = React.useState(false);
  const asyncModule = React.useRef<DynamicComponent | string>();

  const props = useConnection({ props: node.props || {}, stateHub });

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
      React.createElement(renderChildren, { nodes: node.children || [], stateHub: stateHub }),
    )
  );
}

type RenderSchemaParams = {
  schema: InstantiatedSchema;
  rootEle: Element;
  stateHub: StateHub;
}

function renderSchema({ schema, rootEle, stateHub }: RenderSchemaParams): void {
  // register('@basicComponents', getBasicComponentsOptions());
  // register('@advancesComponents', getAdvancedComponentsOptions());

  ReactDOM.render(React.createElement(renderNode, { node: schema.node, stateHub }), rootEle);
}

export default renderSchema;
