import React, { useState } from 'react';
import cs from 'classnames';

import { NodePrimary } from './types';
import EntryNameInput from './entry-name-input';

interface Props {
  id: string;
  name: string;
  isSelected: boolean;
  onNameChange: (newName: string) => void;
  iconRender: (node: NodePrimary) => JSX.Element;
  onClick: () => void;
}

const style: React.CSSProperties = {
  '--spacing': `4px`,
} as React.CSSProperties;

function RootEntry({ name, onNameChange, onClick, isSelected }: Props): JSX.Element {
  const [renaming, setRenaming] = useState(false);

  return (
    <div style={style} className={cs('outline-entry', { 'outline-entry--selected': isSelected })}>
      <div className={cs('outline-entry-content')}>
        {renaming ? (
          <EntryNameInput
            name={name}
            onCancel={() => setRenaming(false)}
            onChange={(newName) => {
              onNameChange(newName);
              setRenaming(false);
            }}
          />
        ) : (
          <span onClick={onClick} onDoubleClick={() => setRenaming(true)} className="outline-entry__name">
            {name}
          </span>
        )}
      </div>
    </div>
  );
}

export default RootEntry;
