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
    <div>
      <span
        className={status === '' ? 'active' : ''}
        onClick={() => toggleStatus('')}
      >
        {`All (${all})`}
      </span>
      <span
        className={status === 'working' ? 'active' : ''}
        onClick={() => toggleStatus('working')}
      >
        {`Working (${working})`}
      </span>
      <span
        className={status === 'done' ? 'active' : ''}
        onClick={() => toggleStatus('done')}
      >
        {`Done (${done})`}
      </span>
    </div>
  );
}

export default TodoFilter;
