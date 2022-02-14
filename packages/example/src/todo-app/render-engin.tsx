import React from 'react';
import { RefLoader, Repository, SchemaRender } from '@one-for-all/render-engine';
import { SwaggerSpecAdapter } from '@one-for-all/api-spec-adapter';

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
    plugins: { apiSpecAdapter },
  });
};

export default function RenderByEngine(): JSX.Element {
  return React.createElement(SchemaRender, { schema, plugins: { apiSpecAdapter, repository, refLoader } });
}
