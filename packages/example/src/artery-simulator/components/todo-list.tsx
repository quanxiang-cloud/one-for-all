import React from 'react';
import { useEffect } from 'react';

import './todo-list.scss';
import TodoItem from './todo-item';

type Todo = { id: number; title: string; status: 'working' | 'done' };

type Props = {
  todos: Array<Todo>;
  toggleTodo: (todo: Todo) => void;
  onFetchTodos: () => void;
  onDeleteTodo: (todoID: number) => void;
  __exposeState: (state: any) => void;
};

export default function TodoList({
  todos,
  toggleTodo,
  onFetchTodos,
  onDeleteTodo,
  __exposeState,
}: Props): JSX.Element {
  useEffect(() => onFetchTodos(), []);

  useEffect(() => {
    __exposeState(todos);
  }, [todos]);

  return (
    <div className="todo-list">
      {todos.map((todo) => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleTodo={(newTodo: Todo) => toggleTodo(newTodo)}
            onDeleteTodo={onDeleteTodo}
          />
        );
      })}
    </div>
  );
}
