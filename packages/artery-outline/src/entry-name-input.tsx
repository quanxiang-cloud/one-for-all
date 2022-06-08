import React, { useEffect, useRef } from 'react';

export interface NameInput {
  name: string;
  onCancel: () => void;
  onChange: (newName: string) => void;
}
export default function EntryNameInput({ name, onCancel, onChange }: NameInput): JSX.Element {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();

    function onClickOutSide(e: MouseEvent): void {
      if (e.target !== ref.current) {
        onCancel();
      }
    }

    document.addEventListener('click', onClickOutSide);

    return () => document.removeEventListener('click', onClickOutSide);
  }, []);

  function handleEnterKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Escape') {
      onCancel();
      return;
    }

    if (e.key !== 'Enter') {
      return;
    }

    const newName = ref.current?.value.trim();
    if (!newName || newName === name) {
      onCancel();
      return;
    }

    onChange(newName);
  }

  return (
    <div className="outline-entry__name">
      <input ref={ref} type="text" defaultValue={name} onKeyDown={handleEnterKeyDown} />
    </div>
  );
}
