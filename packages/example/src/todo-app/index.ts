import React from 'react';
import ReactDOM from 'react-dom';
import { RefLoader, Repository, SchemaRender } from '@ofa/render-engine';
import { SwaggerSpecAdapter } from '@ofa/api-spec-adapter';

import schema from './serialized-schema';
import refSchema from './ref-schema';
import apiDoc from './api-doc';
import TodoList from './components/todo-list';
import TodoInput from './components/todo-input';
import TodoFilter from './components/todo-filter';

const apiSpecAdapter = new SwaggerSpecAdapter(apiDoc);
const appRoot = document.querySelector('#root');
const repository: Repository = {
  'todo-app@whatever': {
    TodoList: TodoList,
    TodoInput: TodoInput,
    TodoFilter: TodoFilter,
  },
};

const refLoader: RefLoader = () => {
  return Promise.resolve({
    schema: refSchema,
    apiSpecAdapter,
  });
};

if (!appRoot) {
  throw new Error('appRoot is null, can not render app.');
}

ReactDOM.render(
  React.createElement(SchemaRender, { schema, apiSpecAdapter, repository, refLoader }),
  appRoot,
);
