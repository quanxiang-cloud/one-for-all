import React from 'react';
import DatePickerComp from '../date-picker-comp';

export default function DateTimePicker(props: Omit<DatePickerProps, 'mode' | 'timeAccuracy'>) {
  return <DatePickerComp mode="date" {...props} />;
}
