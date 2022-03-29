import React from 'react';

import './todo-list.scss';

type Todo = { id: number; title: string; status: 'working' | 'done' };

type Props = {
  todo: Todo;
  onToggleTodo: (todo: Todo) => void;
  onDeleteTodo: (todoID: number) => void;
};

export default function TodoItem({ todo, onToggleTodo, onDeleteTodo }: Props): JSX.Element {
  return (
    <p key={todo.id} className="todo-list__todo todo" data-done={todo.status === 'done'}>
      <input
        className="todo__toggle"
        type="checkbox"
        checked={todo.status === 'done'}
        onChange={() => onToggleTodo({ ...todo, status: todo.status === 'done' ? 'working' : 'done' })}
      />
      <span className="todo__title">{todo.title}</span>
      <button className="todo__action" onClick={() => onDeleteTodo(todo.id)}>
        X
      </button>
    </p>
  );
}
