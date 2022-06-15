import React from 'react';
import DatePickerComp from '../date-picker-comp';

export default function TimePicker(props: Omit<DatePickerProps, 'mode'>) {
  return <DatePickerComp mode="time" {...props} />;
}