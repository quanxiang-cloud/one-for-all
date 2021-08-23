import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { OpenAPIV3 } from 'openapi-types';

import logger from '@ofa/utils/src/logger';

import {
  importComponent,
  register,
  // getBasicComponentsOptions,
  // getAdvancedComponentsOptions,
} from './repository';
import { APIDerivedProperty,
  APIInvokeProperty,
  ConstantProperty,
  DynamicComponent,
  HTMLNode,
  ReactComponentNode,
  Schema,
} from './types';
import StateHub from './state-hub';
import useAPIState from './use-api-state';

type RenderNodesProps = {
  nodes: Array<HTMLNode | ReactComponentNode>;
  stateHub: StateHub;
}

function renderChildren({ nodes, stateHub }: RenderNodesProps): React.ReactNode[] | undefined {
  if (!nodes.length) {
    return;
  }

  return nodes.map((node) => renderNode({ node, stateHub }));
}

type RenderNodeProps = {
  node: HTMLNode | ReactComponentNode;
  stateHub: StateHub;
}

function renderNode({ node, stateHub }: RenderNodeProps): React.ReactElement | null {
  const [loaded, setLoaded] = React.useState(false);
  const asyncModule = React.useRef<DynamicComponent | string>();

  const props = bindProps(node.props || {}, stateHub);

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

  return React.createElement(
    asyncModule.current,
    props,
    renderChildren({ nodes: node.children || [], stateHub }),
  );
}

// todo give me a better name
function bindProps(
  props: Record<string, ConstantProperty | APIDerivedProperty | APIInvokeProperty>,
  stateHub: StateHub,
): Record<string, any> {
  const constantProps: Record<string, any> = {};
  const apiStateProps: Record<string, APIInvokeProperty | APIDerivedProperty> = {};
  Object.entries(props).forEach(([key, propDesc]) => {
    if (propDesc.type === 'constant_property') {
      constantProps[key] = propDesc.value;
      return;
    }

    apiStateProps[key] = propDesc;
  });

  const apiProps = useAPIState({ props: apiStateProps, stateHub });

  const [finalProps] = useState(Object.assign(constantProps, apiProps));
  return finalProps;
}

type RenderSchemaParams = {
  schema: Schema;
  rootEle: HTMLElement;
  apiDoc: OpenAPIV3.Document;
}

function renderSchema({ schema, rootEle, apiDoc }: RenderSchemaParams): void {
  // register('@basicComponents', getBasicComponentsOptions());
  // register('@advancesComponents', getAdvancedComponentsOptions());

  const stateHub = new StateHub(apiDoc, schema.stateAPIMap);

  ReactDOM.render(React.createElement(renderNode, { node: schema.node, stateHub }), rootEle);
}

export default renderSchema;
export { register };
