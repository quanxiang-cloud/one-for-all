import React from 'react';
import type { Schema } from '@one-for-all/schema-spec';
import { RefLoader, Repository, SchemaRender } from '@one-for-all/render-engine';
import { SwaggerSpecAdapter } from '@one-for-all/api-spec-adapter';

import rootSchema from './root-schema';
import apiDoc from './api-doc';
import todoAppMainSchema from './todo-app/todo-app-main-schema';
import todoHeaderSchema from './todo-app/todo-header';
import todoAppRepository from './todo-app/repository';

const apiSpecAdapter = new SwaggerSpecAdapter(apiDoc);
const repository: Repository = Object.assign({}, todoAppRepository);

const schemaDB: Record<string, Schema> = {
  SCHEMA_ID_TODO: todoAppMainSchema,
  SCHEMA_ID_TODO_HEADER: todoHeaderSchema,
}

const refLoader: RefLoader = (schemaID: string) => {
  if (!schemaDB[schemaID]) {
    return Promise.reject(`no schema found for: ${schemaID}`);
  }
  return Promise.resolve({
    schema: schemaDB[schemaID],
    plugins: { apiSpecAdapter },
  });
};

export default function App(): JSX.Element {
  return React.createElement(SchemaRender, { schema: rootSchema, plugins: { apiSpecAdapter, repository, refLoader } });
}
