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
}

const style: React.CSSProperties = {
  '--spacing': `0`,
} as React.CSSProperties;

function RootEntry({ name, onNameChange }: Props): JSX.Element {
  const [renaming, setRenaming] = useState(false);

  return (
    <div style={style} className={cs('outline-entry')}>
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
          <span onDoubleClick={() => setRenaming(true)} className="outline-entry__name">
            {name}
          </span>
        )}
      </div>
    </div>
  );
}

export default RootEntry;
