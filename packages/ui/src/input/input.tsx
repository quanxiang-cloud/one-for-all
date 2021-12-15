import React from 'react';

export interface Props {
  style?: React.CSSProperties;
  children?: React.ReactNode;
  placeholder?: string;
  type?: string;
}

function Input(props: Props): JSX.Element {
  const { placeholder, type } = props;
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
      ></input>
    </>
  );
}
export default Input;
