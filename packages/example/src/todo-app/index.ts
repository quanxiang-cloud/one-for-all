import React from 'react';
import ReactDOM from 'react-dom';
import type { Artery } from '@one-for-all/artery';
import { RefLoader, Repository, ArteryRenderer } from '@one-for-all/artery-renderer';
import { SwaggerSpecAdapter } from '@one-for-all/api-spec-adapter';

import todoAppMainSchema from './todo-app-main-schema';
import todoHeaderSchema from './todo-header';
import todoAppRepository from './repository';
import apiDoc from '../api-doc';
import { worker } from '../mocks/browser';

const apiSpecAdapter = new SwaggerSpecAdapter(apiDoc);
const repository: Repository = Object.assign(
  {},
  todoAppRepository,
);

const schemaDB: Record<string, Artery> = {
  SCHEMA_ID_TODO_HEADER: todoHeaderSchema,
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

function TodoApp(): JSX.Element {
  return React.createElement(ArteryRenderer, {
    artery: todoAppMainSchema,
    plugins: { apiSpecAdapter, repository, refLoader },
  });
}

worker.start();
const appRoot = document.querySelector('#root');

if (!appRoot) {
  throw new Error('appRoot is null, can not render app.');
}

ReactDOM.render(React.createElement(TodoApp), appRoot);
