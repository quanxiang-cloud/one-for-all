import React from 'react';
import type { Schema } from '@one-for-all/schema-spec';
import { RefLoader, Repository, SchemaRender } from '@one-for-all/render-engine';
import { SwaggerSpecAdapter } from '@one-for-all/api-spec-adapter';

import rootSchema from './root-schema';
import apiDoc from './api-doc';
import todoAppMainSchema from './todo-app/todo-app-main-schema';
import todoHeaderSchema from './todo-app/todo-header';
import todoAppRepository from './todo-app/repository';

import styleGuideSchema from './component-style-config/schema';
import styleGuideRepository from './component-style-config/repository';

import iconPreviewSchema from './icon-preview/schema';
import iconPreviewRepository from './icon-preview/repository';

const apiSpecAdapter = new SwaggerSpecAdapter(apiDoc);
const repository: Repository = Object.assign({}, todoAppRepository, styleGuideRepository, iconPreviewRepository);

const schemaDB: Record<string, Schema> = {
  SCHEMA_ID_TODO: todoAppMainSchema,
  SCHEMA_ID_TODO_HEADER: todoHeaderSchema,
  SCHEMA_ID_STYLE_GUIDE: styleGuideSchema,
  SCHEMA_ID_ICON_PREVIEW: iconPreviewSchema,
}

const refLoader: RefLoader = (schemaID: string) => {
  if (!schemaDB[schemaID]) {
    return Promise.reject(`no schema found for: ${schemaID}`);
  }

  return Promise.resolve({
    schema: schemaDB[schemaID],
    plugins: { apiSpecAdapter, repository },
  });
};

export default function App(): JSX.Element {
  return React.createElement(SchemaRender, { schema: rootSchema, plugins: { apiSpecAdapter, repository, refLoader } });
}
