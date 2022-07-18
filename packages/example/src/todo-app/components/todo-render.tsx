import React, { useEffect, useState } from 'react';
import type { Artery } from '@one-for-all/artery';
import { RefLoader, Repository, ArteryRenderer } from '@one-for-all/artery-renderer';
import { SwaggerSpecAdapter } from '@one-for-all/api-spec-adapter';

import todoHeaderSchema from '../todo-header';
import todoAppRepository from '../repository';
import apiDoc from '../../api-doc';

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

function useKey(artery?: Artery): string {
  const [key, setKey] = useState('key');

  useEffect(() => {
    setKey(Math.random().toString(36).substring(2, 9));
  }, [artery]);

  return key;
}

interface Props {
  artery?: Artery;
}

function TodoRender({ artery }: Props): JSX.Element {
  const key = useKey(artery);
  if (!artery) {
    return (
      <div>edit artery on the right please.</div>
    )
  }

  return React.createElement(ArteryRenderer, {
    key,
    artery: artery,
    plugins: { apiSpecAdapter, repository, refLoader },
  });
}

export default TodoRender;
