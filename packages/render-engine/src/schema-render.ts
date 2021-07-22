import React from 'react';
import ReactDOM from 'react-dom';

import {
  importComponent,
  register,
  // getBasicComponentsOptions,
  // getAdvancedComponentsOptions,
} from './repository';

function renderChildren(schemas: Array<Schema | string>): React.ReactNode[] | undefined {
  if (!schemas.length) {
    return;
  }

  return schemas.map((schema) => {
    if (typeof schema === 'string') {
      return schema;
    }

    return React.createElement(renderSchema, { schema, key: schema.props.key });
  });
}

function renderSchema({ schema }: { schema: Schema }): React.ReactElement {
  const [loaded, setLoaded] = React.useState(false);
  const asyncModule = React.useRef<DynamicComponent | string>();

  React.useEffect(() => {
    const [elementScope, elementType, version] = schema.element.split(':')
    if (elementScope === 'html') {
      asyncModule.current = elementType;
      setLoaded(true);
      return;
    }

    // todo catch import error
    importComponent(elementScope, elementType, version).then((comp) => {
      if (!comp) {
        console.error(`got empty component for elementScope: ${elementScope}, elementType: ${elementType}, version: ${version}`);
      }
      asyncModule.current = comp;
      setLoaded(true);
    })
  }, []);

  if (!loaded || !asyncModule.current) {
    // todo loading component
    return React.createElement('span', null, 'loading');
  }

  return React.createElement(asyncModule.current, schema.props, renderChildren(schema.children || []));
}

function _renderSchema(schema: Schema, rootEle: Element) {
  // register('@basicComponents', getBasicComponentsOptions());
  // register('@advancesComponents', getAdvancedComponentsOptions());

  ReactDOM.render(React.createElement(renderSchema, { schema }), rootEle);
}

export default _renderSchema;
export { register };
