import { RequestParams } from '@ofa/spec-interpreter/src/types';
import { Schema } from '@ofa/render-engine/src/types';

const todoAppSchema: Schema = {
  stateAPIMap: {
    createTodo: 'createTodo',
    listTodos: 'listTodos',
  },
  node: {
    key: 'container',
    type: 'html-element',
    name: 'div',
    props: {
      id: { type: 'constant_property', value: 'container' },
    },
    children: [
      {
        key: 'todo-input-form',
        type: 'html-element',
        name: 'form',
        props: {
          id: { type: 'constant_property', value: 'todo-input-form' },
          onSubmit: {
            type: 'api_invoke_property',
            stateID: 'createTodo',
            // onSubmit => requestParams => run
            convertor: (e: React.FormEvent<HTMLFormElement>): RequestParams | undefined => {
              e.preventDefault();
              e.stopPropagation();

              const formData = new FormData(e.target as HTMLFormElement);
              const body = {};
              for (const key of formData.keys()) {
                body[key] = formData.get(key);
              }

              return { body };
            },
            onSuccess: (): void => {
              // contexts.store.call refresh again
              // reset form
              const form = document.getElementById('todo-input-form') as HTMLFormElement;
              form?.reset?.();
              window.stateHub.getAction('listTodos')();
            },
          },
        },
        children: [
          {
            key: 'todo-input',
            type: 'html-element',
            name: 'input',
            props: {
              type: { type: 'constant_property', value: 'input' },
              name: { type: 'constant_property', value: 'title' },
              placeholder: { type: 'constant_property', value: 'What do you want to do?' },
            },
          },
          {
            key: 'add-todo-btn',
            type: 'html-element',
            name: 'button',
            props: {
              type: { type: 'constant_property', value: 'submit' },
              children: { type: 'constant_property', value: 'add todo' },
            },
          },
        ],
      },
    ],
  },
};

export default todoAppSchema;
