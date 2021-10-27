import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

type Props = {
  all: number;
  working: number;
  done: number;
  onToggleStatus: (statue: string) => void;
  onFetchStatus: () => void;
}

function TodoFilter({ all, working, done, onToggleStatus, onFetchStatus }: Props): JSX.Element {
  const [status, setStatus] = useState('');
  useEffect(() => onFetchStatus(), []);

  function toggleStatus(s: string): void {
    setStatus(s);
    onToggleStatus(s);
  }

  return (
    <div className="todo-filter">
      <span
        className="todo-status"
        data-active={status === '' ? 'true' : 'false'}
        onClick={() => toggleStatus('')}
      >
        {`All (${all})`}
      </span>
      <span
        className="todo-status"
        data-active={status === 'working' ? 'true' : 'false'}
        onClick={() => toggleStatus('working')}
      >
        {`Working (${working})`}
      </span>
      <span
        className="todo-status"
        data-active={status === 'done' ? 'true' : 'false'}
        onClick={() => toggleStatus('done')}
      >
        {`Done (${done})`}
      </span>
    </div>
  );
}

export default TodoFilter;
