import React, { useState, useEffect, Ref } from 'react';
import cs from 'classnames';
import Icon from '@one-for-all/icon';
import dayjs, { Dayjs } from 'dayjs';

import { isLegalDate, transformDate, getQuarterByMonth, defaultFormatMap } from '../utils';

interface Props {
  placeholder?: string;
  date?: Dayjs;
  disabled?: boolean;
  readOnly?: boolean;
  suffixIcon?: React.ReactNode;
  mode: DatePickerModeType;
  format?: ((date: Date) => string) | string;
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
    timeAccuracy,
    onChangeInput,
    onBlur,
    onClick,
    onClear,
  }: Props,
  ref?: Ref<HTMLDivElement>,
) {
  const [inputValue, setInputValue] = useState(formatDate(date));
  const [hover, setHover] = useState(false);

  useEffect(() => {
    setInputValue(formatDate(date));
  }, [date]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  };

  function handleBlur() {
    onBlur?.();
    setInputValue(formatDate(date));
  };

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.keyCode !== 13) return;
    if (inputValue && isLegalDate(inputValue, mode)) {
      const inputDate = dayjs(transformDate(inputValue, mode));
      if (onChangeInput?.(inputDate) === false) {
        setInputValue(formatDate(date));
      }
    } else {
      setInputValue(formatDate(date));
    }
  };

  function formatDate(date: Dayjs | undefined): string {
    if (!date) return '';
  
    if (typeof format === 'string') {
      return date.format(format).replace('Q', getQuarterByMonth(date.month()));
    }
  
    if (typeof format === 'function') {
      return format(date.toDate());
    }
  
    let formatStr = defaultFormatMap[mode];
    if (mode === 'date' && timeAccuracy) {
      formatStr = 'YYYY-MM-DD HH:mm:ss';
    }
  
    return date.format(formatStr).replace('Q', getQuarterByMonth(date.month()));
  }

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
