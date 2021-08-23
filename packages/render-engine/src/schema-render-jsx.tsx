import React from 'react';
import ReactDOM from 'react-dom';
import { OpenAPIV3 } from 'openapi-types';

import { logger } from '@ofa/utils';

import {
  importComponent,
  register,
  // getBasicComponentsOptions,
  // getAdvancedComponentsOptions,
} from './repository';
import {
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

function RenderChildren({ nodes, stateHub }: RenderNodesProps): JSX.Element | null {
  if (!nodes.length) {
    return null;
  }

  return (<>{nodes.map((node) => (<RenderNode key={node.key} node={node} stateHub={stateHub} />))}</>);
}

type RenderNodeProps = {
  node: HTMLNode | ReactComponentNode;
  stateHub: StateHub;
}

function RenderNode({ node, stateHub }: RenderNodeProps): React.ReactElement | null {
  const [loaded, setLoaded] = React.useState(false);
  const asyncModule = React.useRef<DynamicComponent | string>();

  const props = useAPIState({ props: node.props || {}, stateHub });

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

  const Comp = asyncModule.current;

  if (!node.children || !node.children.length) {
    return (<Comp {...props} />);
  }

  return (
    <Comp {...props}>
      <RenderChildren nodes={node.children || []} stateHub={stateHub} />
    </Comp>
  );
}

type RenderSchemaParams = {
  schema: Schema;
  rootEle: Element;
  apiDoc: OpenAPIV3.Document;
}

function renderSchema({ schema, rootEle, apiDoc }: RenderSchemaParams): void {
  // register('@basicComponents', getBasicComponentsOptions());
  // register('@advancesComponents', getAdvancedComponentsOptions());

  const stateHub = new StateHub(apiDoc, schema.stateAPIMap);
  // todo give this a better design
  window.stateHub = stateHub;

  ReactDOM.render(React.createElement(RenderNode, { node: schema.node, stateHub }), rootEle);
}

export default renderSchema;
export { register };
