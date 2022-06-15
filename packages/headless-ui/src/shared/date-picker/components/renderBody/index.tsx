import React from 'react';
import { Dayjs } from 'dayjs';

import { RenderBodyProps } from '../datePickerPanel';
import { PickScope } from '../../utils';
import RenderDatePicker from './renderDatePicker';
import RenderMonthPicker from './renderMonthPicker';
import RenderQuarterPicker from './renderQuarterPicker';
import RenderYearPicker from './renderYearPicker';
import RenderCenturyPicker from './renderCenturyPicker';
import RenderTimePicker from './renderTimePicker';

interface Props extends RenderBodyProps {
  pickScope: PickScope,
  onPickScopeChange: (mode: PickScope) => void;
  disabledDate?: (date: Date) => boolean;
  disabledTime?: (type: DatePickerTimeAccuracyType, time: number) => boolean;
  mode: DatePickerModeType,
  timeAccuracy?: DatePickerTimeAccuracyType;
}

export default function RenderBody({
  pickScope,
  mode,
  timeAccuracy,
  onPickScopeChange,
  disabledDate,
  disabledTime,
  panelDate,
  pickedDate,
  changePick,
  confirmPick,
}: Props): JSX.Element {
  function handleChangePicker(date: Dayjs, nextScope: PickScope) {
    if (mode === pickScope && !timeAccuracy) {
      confirmPick(date);
      return;
    }
    nextScope && onPickScopeChange(nextScope);
    changePick(date);
  }

  return (
    <>
      {pickScope === 'date' && (
        <RenderDatePicker
          date={panelDate}
          pickedDate={pickedDate}
          onChange={(date) => handleChangePicker(date, '')}
          disabledDate={disabledDate}
        />
      )}
      {pickScope === 'month' && (
        <RenderMonthPicker
          date={panelDate}
          pickedDate={pickedDate}
          onChange={(date) => handleChangePicker(date, 'date')}
          disabledDate={disabledDate}
        />
      )}
      {pickScope === 'quarter' && (
        <RenderQuarterPicker
          date={panelDate}
          pickedDate={pickedDate}
          onChange={(date) => handleChangePicker(date, 'date')}
          disabledDate={disabledDate}
        />
      )}
      {pickScope === 'year' && (
        <RenderYearPicker
          date={panelDate}
          pickedDate={pickedDate}
          onChange={(date) => handleChangePicker(date, mode === 'quarter' ? 'quarter' : 'month')}
          disabledDate={disabledDate}
        />
      )}
      {pickScope === 'century' && (
        <RenderCenturyPicker
          date={panelDate}
          pickedDate={pickedDate}
          onChange={(date) => handleChangePicker(date, 'year')}
        />
      )}
      {timeAccuracy && (
        <RenderTimePicker
          hasLeftBorder={mode !== 'time'}
          timeAccuracy={timeAccuracy}
          pickedDate={pickedDate}
          onChange={changePick}
          disabledTime={disabledTime}
        />
      )}
    </>
  );
}
