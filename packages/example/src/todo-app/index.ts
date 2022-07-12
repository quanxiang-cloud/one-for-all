import React from 'react';
import ReactDOM from 'react-dom';
import type { Artery } from '@one-for-all/artery';
import { Repository, ArteryRenderer } from '@one-for-all/artery-renderer';

import todoWithEditor from './todo-app-with-editor';
import todoAppMainSchema from './todo-app-main-schema';
import todoHeaderSchema from './todo-header';
import Editor from './components/editor';
import TodoRender  from './components/todo-render';
import { worker } from '../mocks/browser';

const repository: Repository = {
  'todo-with-editor@whatever': {
    Editor: Editor,
    TodoRender: TodoRender,
  },
}

const schemaDB: Record<string, Artery> = {
  SCHEMA_ID_TODO_HEADER: todoHeaderSchema,
  SCHEMA_ID_TODO_APP: todoAppMainSchema,
};

function TodoApp(): JSX.Element {
  return React.createElement(ArteryRenderer, {
    artery: todoWithEditor,
    plugins: { repository },
  });
}

worker.start();
const appRoot = document.querySelector('#root');

if (!appRoot) {
  throw new Error('appRoot is null, can not render app.');
}

ReactDOM.render(React.createElement(TodoApp), appRoot);
