import React, { useState, ChangeEvent, forwardRef } from 'react';
import { DateTimePickerProps } from './config-form';

import './index.scss'
interface Props extends DateTimePickerProps {
  className?: string;
  'data-node-key'?: string;
  onChange?: (unixTimeStamp: number) => void;
}

function DatePicker(props: Props, ref: React.Ref<HTMLInputElement>): JSX.Element {
  const {
    defaultValue,
    dateType,
    name,
    onChange
  } = props;
  const dataNodeKey = props['data-node-key'] || '';
  const [unixTimeStamp, setUnixTimeStamp] = useState(defaultValue * 1000);

  function onDateChange(e: ChangeEvent<HTMLInputElement>): void {
    setUnixTimeStamp(() => {
      const newTimeStamp = new Date(e.target.value).getTime();
      onChange?.(newTimeStamp / 1000);
      return newTimeStamp;
    });
  }

  function valueToDateString(unixTimeStamp: number): string {
    const date = unixTimeStamp ? new Date(unixTimeStamp) : new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const min = date.getMinutes();

    if (dateType === 'date') return `${year}-${month}-${day}`;
    return `${year}-${month}-${day}T${hour}:${min}`;
  }

  return (
    <input
      className="page-engine-form-calendar p-4 mb-4 border-2 rounded-4"
      data-node-key={dataNodeKey}
      ref={ref}
      name={name}
      type={dateType}
      onChange={onDateChange}
      value={valueToDateString(unixTimeStamp)}
    />
  );
}

export default forwardRef(DatePicker);
