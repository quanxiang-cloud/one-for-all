import React from 'react';

export interface CheckboxGroupContext<T extends ValueType> {
  name?: string;
  value: T[];
  disabled: boolean;
  toggleOption: (option: OptionType<T>) => void;
  registerValue: (val: T) => void;
  cancelValue: (val: T) => void;
}

export default React.createContext<CheckboxGroupContext<any> | null>(null);
