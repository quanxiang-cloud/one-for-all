import React from 'react';
import DatePickerComp from '../date-picker-comp';

export default function DatePicker(props: Omit<DatePickerProps, 'mode'>) {
  return <DatePickerComp mode="date" {...props} />;
}