import React from 'react';
import type { Artery } from '@one-for-all/artery';
import { RefLoader, Repository, ArteryRenderer } from '@one-for-all/artery-renderer';
import { SwaggerSpecAdapter } from '@one-for-all/api-spec-adapter';

import rootArtery from './root-artery';
import apiDoc from './api-doc';
import todoAppMainSchema from './todo-app/todo-app-main-schema';
import todoHeaderSchema from './todo-app/todo-header';
import todoAppRepository from './todo-app/repository';

import styleGuideSchema from './component-style-config/schema';
import styleGuideRepository from './component-style-config/repository';

import iconPreviewSchema from './icon-preview/schema';
import iconPreviewRepository from './icon-preview/repository';

import scssFormingArtery from './scss-forming/artery';
import scssFormingRepo from './scss-forming/repository';

const apiSpecAdapter = new SwaggerSpecAdapter(apiDoc);
const repository: Repository = Object.assign(
  {},
  todoAppRepository,
  styleGuideRepository,
  iconPreviewRepository,
  scssFormingRepo,
);

const schemaDB: Record<string, Artery> = {
  SCHEMA_ID_TODO: todoAppMainSchema,
  SCHEMA_ID_TODO_HEADER: todoHeaderSchema,
  SCHEMA_ID_STYLE_GUIDE: styleGuideSchema,
  SCHEMA_ID_ICON_PREVIEW: iconPreviewSchema,
  SCHEMA_ID_SCSS_FORMING: scssFormingArtery,
};

const refLoader: RefLoader = (arteryID: string) => {
  if (!schemaDB[arteryID]) {
    return Promise.reject(`no schema found for: ${arteryID}`);
  }

  return Promise.resolve({
    artery: schemaDB[arteryID],
    plugins: { apiSpecAdapter, repository },
  });
};

export default function App(): JSX.Element {
  return React.createElement(ArteryRenderer, {
    artery: rootArtery,
    plugins: { apiSpecAdapter, repository, refLoader },
  });
}
