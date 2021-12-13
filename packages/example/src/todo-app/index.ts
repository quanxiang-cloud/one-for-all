import React from 'react';
import ReactDOM from 'react-dom';
import RenderEngine, { Repository, SchemaRender } from '@ofa/render-engine';
import { SwaggerSpecAdapter } from '@ofa/api-spec-adapter';

import schema from './serialized-schema';
import apiDoc from './api-doc';
import TodoList from './components/todo-list';
import TodoInput from './components/todo-input';
import TodoFilter from './components/todo-filter';

const apiSpecAdapter = new SwaggerSpecAdapter(apiDoc);
const renderRoot = document.querySelector('#react-root');
const schemaRenderRoot = document.querySelector('#schema-react-root');
const repository: Repository = {
  'todo-app@whatever': {
    TodoList: TodoList,
    TodoInput: TodoInput,
    TodoFilter: TodoFilter,
  },
};

const renderEngine = new RenderEngine({ schema, apiSpecAdapter });
if (renderRoot) {
  renderEngine.render(renderRoot);
}

ReactDOM.render(React.createElement(SchemaRender, { schema, apiSpecAdapter, repository }), schemaRenderRoot);
