import React from 'react';
import { RefLoader, Repository, SchemaRender } from '@ofa/render-engine';
import { SwaggerSpecAdapter } from '@ofa/api-spec-adapter';

import schema from './serialized-schema';
import refSchema from './ref-schema';
import apiDoc from './api-doc';
import TodoList from './components/todo-list';
import TodoInput from './components/todo-input';
import TodoFilter from './components/todo-filter';

const apiSpecAdapter = new SwaggerSpecAdapter(apiDoc);
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

export default function RenderByEngine(): JSX.Element {
  return React.createElement(SchemaRender, { schema, apiSpecAdapter, repository, refLoader });
}
