import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

type Props = {
  onToggleStatus: (statue: string) => void;
};

function TodoFilter({ onToggleStatus }: Props): JSX.Element {
  const [status, setStatus] = useState('');

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
        All
      </span>
      <span
        className="todo-status"
        data-active={status === 'working' ? 'true' : 'false'}
        onClick={() => toggleStatus('working')}
      >
        Working
      </span>
      <span
        className="todo-status"
        data-active={status === 'done' ? 'true' : 'false'}
        onClick={() => toggleStatus('done')}
      >
        done
      </span>
    </div>
  );
}

export default TodoFilter;
