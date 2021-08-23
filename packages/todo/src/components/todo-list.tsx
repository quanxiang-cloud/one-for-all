import React from 'react';

type Props = {
  todos: Array<{ id: number; title: string; status: 'working' | 'done'; }>
}

export default function TodoList({ todos }: Props): JSX.Element {
  return (
    <div>
      <div>This is todo list</div>
      {
        todos.map((todo) => {
          return (
            <p key={todo.id}>{todo.title}</p>
          );
        })
      }
    </div>
  );
}
