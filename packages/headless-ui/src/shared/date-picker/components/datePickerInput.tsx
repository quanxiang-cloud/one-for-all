import React, { useState, useEffect, Ref } from 'react';
import cs from 'classnames';
import Icon from '@one-for-all/icon';
import dayjs, { Dayjs } from 'dayjs';

import { isLegalDate, transformDate, formatDate } from '../utils';

interface Props {
  placeholder?: string;
  date?: Dayjs;
  disabled?: boolean;
  readOnly?: boolean;
  suffixIcon?: React.ReactNode;
  mode: DatePickerModeType;
  format: ((date: Date) => string) | string;
  timeAccuracy?: DatePickerTimeAccuracyType;
  onChangeInput?: (date: Dayjs) => boolean;
  onClick?: (e: React.MouseEvent) => void;
  onBlur?: () => void;
  onClear?: () => void;
}

function DatePickerInput(
  {
    placeholder = '请输入日期',
    date,
    disabled,
    readOnly,
    suffixIcon,
    mode,
    format,
    onChangeInput,
    onBlur,
    onClick,
    onClear,
  }: Props,
  ref?: Ref<HTMLDivElement>,
) {
  const [inputValue, setInputValue] = useState(formatDate(date, format));
  const [hover, setHover] = useState(false);

  useEffect(() => {
    setInputValue(formatDate(date, format));
  }, [date]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  };

  function handleBlur() {
    onBlur?.();
    setInputValue(formatDate(date, format));
  };

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.keyCode !== 13) return;
    if (inputValue && isLegalDate(inputValue, mode)) {
      const inputDate = dayjs(transformDate(inputValue, mode));
      if (onChangeInput?.(inputDate) === false) {
        setInputValue(formatDate(date, format));
      }
    } else {
      setInputValue(formatDate(date, format));
    }
  };

  return (
    <div
      ref={ref}
      className={cs('ofa-date-picker-input', disabled && 'is-disabled')}
      onMouseEnter={() => !disabled && setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <input
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        readOnly={readOnly || !!format}
      />
      {hover ?
        <Icon name="close" size={16} onClick={onClear} />
        : (suffixIcon || <Icon name="calendar_today" size={16} />)}
    </div>
  );
}

export default React.forwardRef(DatePickerInput);
