import React from 'react';
import type { Artery } from '@one-for-all/artery';
import { ArteryRenderer } from '@one-for-all/artery-renderer';
import type { RefLoader, Repository } from '@one-for-all/artery-renderer';
import { SwaggerSpecAdapter } from '@one-for-all/api-spec-adapter';

import rootArtery from './root-artery';
import apiDoc from './api-doc';

import simulatorArtery from './artery-simulator/main-artery';
import simulatorRepo from './artery-simulator/repository';

const apiSpecAdapter = new SwaggerSpecAdapter(apiDoc);
const repository: Repository = Object.assign({}, simulatorRepo);

const schemaDB: Record<string, Artery> = {
  SCHEMA_ID_SIMULATOR: simulatorArtery,
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
