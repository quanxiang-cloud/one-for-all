import React from 'react';

export interface RadioGroupContext<T extends ValueType> {
  name?: string;
  value: T;
  disabled: boolean;
  onChange: (val: T) => void;
}

export default React.createContext<RadioGroupContext<any> | null>(null);
