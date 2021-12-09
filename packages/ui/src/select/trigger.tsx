import * as React from 'react';

import Tag from '../tag';
import { SelectOption } from './index';

type SingleSelectTriggerProps<T> = {
  selectedOption?: SelectOption<T>;
  placeholder: string;
};

type MultipleSelectTriggerProps<T> = {
  selectedOption?: SelectOption<T>[];
  placeholder: string | JSX.Element;
  onUnselect: (value: T) => void;
};

export function SingleSelectTrigger<T>({
  selectedOption, placeholder,
}: SingleSelectTriggerProps<T>): JSX.Element {
  if (!selectedOption) {
    return (<span>{placeholder}</span>);
  }

  return (
    <span>{selectedOption.label}</span>
  );
}

export function MultipleSelectTrigger<T extends React.Key>(
  { selectedOption, placeholder, onUnselect }: MultipleSelectTriggerProps<T>,
): JSX.Element {
  if (!selectedOption || !selectedOption.length) {
    return (<span>{placeholder}</span>);
  }

  return (
    <>
      {
        selectedOption.map(({ value, label }) => {
          return (
            <Tag
              className="mr-5"
              key={value}
              id={value}
              value={label}
              onDelete={(id, e): void => {
                e.stopPropagation();
                onUnselect(id);
              }}
            />
          );
        })
      }
    </>
  );
}
