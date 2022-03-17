import React from 'react';

interface Props {
  text: string;
}

export default function Text({ text }: Props): JSX.Element {
  return (
    <span>文本</span>
  )
}
