import React from 'react';
import ReactDOM from 'react-dom';
import RenderEngine, { SchemaRender } from '@ofa/render-engine';
import { SwaggerSpecAdapter } from '@ofa/api-spec-adapter';

import schema from './serialized-schema';
import apiDoc from './api-doc';

const apiSpecAdapter = new SwaggerSpecAdapter(apiDoc);
const renderRoot = document.querySelector('#react-root');
const schemaRenderRoot = document.querySelector('#schema-react-root');

const renderEngine = new RenderEngine({ schema, apiSpecAdapter });
if (renderRoot) {
  renderEngine.render(renderRoot);
}

ReactDOM.render(React.createElement(SchemaRender, { schema, apiSpecAdapter }), schemaRenderRoot);
