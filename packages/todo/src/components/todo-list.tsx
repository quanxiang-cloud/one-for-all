import React from 'react';
import { useEffect } from 'react';

type Todo = { id: number; title: string; status: 'working' | 'done'; };

type Props = {
  todos: Array<Todo>;
  toggleTodo: (todo: Todo) => void;
  onFetchTodos: () => void;
  onDeleteTodo: (todoID: number) => void;
}

export default function TodoList({ todos, toggleTodo, onFetchTodos, onDeleteTodo }: Props): JSX.Element {
  useEffect(() => onFetchTodos(), []);

  return (
    <div>
      {
        todos.map((todo) => {
          return (
            <p key={todo.id}>
              <input
                type="checkbox"
                checked={todo.status === 'done'}
                onChange={() => toggleTodo({ ...todo, status: todo.status === 'done' ? 'working' : 'done' })}
              />
              {todo.title}
              <button onClick={() => onDeleteTodo(todo.id)}>delete me</button>
            </p>
          );
        })
      }
    </div>
  );
}
