import React, { useEffect } from 'react';
import { useState } from 'react';

function ThirdPartyInput(
  props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
): JSX.Element {
  return <input {...props} />;
}

type Props = {
  onEnter: (value: string) => void;
  __exposeState: (value: string) => void;
};

// clear value after enter key down
export default function TodoInput({ onEnter, __exposeState }: Props): JSX.Element {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    __exposeState(value);
  }, [value]);

  function clearInputOnEnterDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') {
      // setLoading(true);
      onEnter(value);
      setValue('');
      __exposeState(value);
    }
  }

  return (
    <ThirdPartyInput
      autoFocus
      value={value}
      disabled={loading}
      onChange={(e) => setValue(e.target.value)}
      className="new-todo"
      placeholder="What needs to be done?"
      onKeyDown={clearInputOnEnterDown}
    />
  );
}
