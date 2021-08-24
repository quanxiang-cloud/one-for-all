import React from 'react';
import { useEffect } from 'react';

import './todo-list.scss';

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
    <div className="todo-list">
      {
        todos.map((todo) => {
          return (
            <p key={todo.id} className="todo-list__todo todo">
              <input
                className="todo__toggle"
                type="checkbox"
                checked={todo.status === 'done'}
                onChange={() => toggleTodo({ ...todo, status: todo.status === 'done' ? 'working' : 'done' })}
              />
              <span className="todo__title">
                {todo.title}
              </span>
              <button className="todo__action" onClick={() => onDeleteTodo(todo.id)}>X</button>
            </p>
          );
        })
      }
    </div>
  );
}
