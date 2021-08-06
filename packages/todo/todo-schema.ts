const schema = {
  element: 'html:div',
  props: { key: 'todo-app' },
  children: [
    {
      element: 'html:header',
      props: { key: 'todo-app-header' },
      children: [
        {
          element: 'html:h1',
          props: { key: 'todo-app-title' },
          children: ['ToDos'],
        },
        {
          element: 'todo-app:TodoInput',
          props: { key: 'todo-app-todo-input' },
        },
      ],
    },
    {
      element: 'todo-app:TodoList',
      props: { key: 'todo-app-todo-list' },
    },
    {
      element: 'html:footer',
      props: { key: 'todo-app-footer' },
      children: [
        {
          element: 'todo-app:TodoCount',
          props: { key: 'todo-app-count' },
        },
        {
          element: 'todo-app:TodoFilter',
          props: { key: 'todo-app-todo-filter' },
        },
      ],
    },
  ],
};

export default schema;
