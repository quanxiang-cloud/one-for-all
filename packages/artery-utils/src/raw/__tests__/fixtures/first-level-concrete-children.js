const node = {
  id: 'container',
  type: 'html-element',
  name: 'div',
  children: [
    {
      id: 'ref-schema',
      type: 'ref-node',
      schemaID: 'whatever',
    },
    {
      id: 'todo-input-container',
      type: 'html-element',
      name: 'div',
    },
    {
      id: 'todo-list-loop-composedNode',
      type: 'loop-container',
      node: {
        id: 'compose-node-container',
        type: 'composed-node',
        nodes: [
          {
            id: 'todo-toggle',
            type: 'html-element',
            name: 'input',
          },
          {
            id: 'todo-title',
            type: 'html-element',
            name: 'span',
          },
          {
            id: 'todo-delete',
            type: 'html-element',
            name: 'button',
          },
        ],
      },
    },
    {
      id: 'footer',
      type: 'html-element',
      name: 'div',
      children: [
        {
          id: 'todo-filter',
          type: 'react-component',
          packageName: 'todo-app',
          exportName: 'TodoFilter',
          packageVersion: 'whatever',
        },
      ],
    },
  ],
};

export default node;
