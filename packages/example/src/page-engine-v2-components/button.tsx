import React from 'react';

interface Props {
  text: string;
}

export default function Button({ text = '按钮' }: Props): JSX.Element {
  return (
    <button>{text}</button>
  )
}
