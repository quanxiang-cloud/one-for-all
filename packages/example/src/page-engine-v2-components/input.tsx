import React from 'react';

interface Props {
  value: string;
  readonly?: boolean;
}

export default function Input({ value, readonly }: Props): JSX.Element {
  return (
    <input readOnly={readonly} type="text" value={value} />
  )
}
