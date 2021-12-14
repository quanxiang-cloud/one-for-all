import React, { useState, CSSProperties } from 'react';
import cs from 'classnames';

import Icon from '../icon';

const InputCss: CSSProperties = {
  background: 'none',
  height: '20px',
  boxShadow: 'none',
  border: 'none',
};

interface Props {
  value?: string;
  placeholder?: string;
  onChange?: (val: string) => void;
  className?: string;
  actions?: React.ReactNode;

  onBlur?(val?: string): void;

  onKeyDown?(e?: React.KeyboardEvent): void;
}

export default function Search(
  { value: _value, placeholder, onChange, onKeyDown, onBlur, className, actions }: Props): JSX.Element {
  const [value, setValue] = useState(_value || '');
  const [focused, setFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
    onChange && onChange(e.target.value);
  };

  function handleClick(): void {
    setValue('');
    onChange && onChange('');
    onBlur && onBlur('');
  }

  function handleInputFocus(): void {
    setFocused(true);
  }

  function handleInputBlur(): void {
    setFocused(false);
    onBlur && onBlur();
  }

  return (
    <div
      className={cs('px-16 py-5 corner-2-8-8-8 bg-white flex items-center border border-gray-300',
        className,
        {
          'input-focus-border': focused,
        })
      }
    >
      <Icon name="search" size={20} className='mr-8' />
      <input
        style={InputCss}
        className="flex-grow w-100 outline-none"
        type="text"
        placeholder={placeholder}
        name="search"
        onChange={handleChange}
        value={value}
        onKeyDown={(e: React.KeyboardEvent) => onKeyDown && onKeyDown(e)}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
      />
      {actions}
      {value !== '' && (
        <Icon
          className="ml-8"
          name="close"
          size={20}
          clickable
          onClick={handleClick}
        />
      )}
    </div>
  );
}
