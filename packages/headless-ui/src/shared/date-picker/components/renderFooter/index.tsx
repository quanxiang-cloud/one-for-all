import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

import { RenderFooterProps } from '../datePickerPanel';
import { PickScope } from '../../utils';
import CommonFooter from './commonFooter';

dayjs.extend(quarterOfYear);

interface Props extends RenderFooterProps {
  mode: DatePickerModeType,
  pickScope: PickScope;
  timeAccuracy?: DatePickerTimeAccuracyType;
  hiddenPresent?: boolean;
  onPickScopeChange: (mode: PickScope) => void;
  disabledDate?: (date: Date) => boolean;
  disabledTime?: (type: DatePickerTimeAccuracyType, time: number) => boolean;
}

export default function RenderFooter({
  mode,
  pickScope,
  timeAccuracy,
  hiddenPresent = false,
  onPickScopeChange,
  changePick,
  confirmPick,
  disabledDate,
  disabledTime,
}: Props): JSX.Element {
  function handleChangePicker(date: Dayjs, nextScope: PickScope) {
    if (mode === pickScope) {
      confirmPick(date);
      return;
    }
    nextScope && onPickScopeChange(nextScope);
    changePick(date);
  }

  function handlePickPresent(startScope: DatePickerModeType | DatePickerTimeAccuracyType, nextScope: PickScope) {
    if (startScope === 'time') return;
    handleChangePicker(dayjs().startOf(startScope), nextScope);
  }

  function isDisabledPresent(startScope: DatePickerModeType): boolean {
    if (startScope === 'time') return false;
    return !!disabledDate?.(dayjs().startOf(startScope).toDate())
  }

  if (timeAccuracy) return (
    <CommonFooter
      onPickPresent={hiddenPresent || disabledTime ? undefined : () => handlePickPresent(timeAccuracy, '')}
      presentText="此刻"
      onConfirm={() => confirmPick()}
    />
  );

  if (pickScope === 'date') return (
    <CommonFooter
      disabledPresent={isDisabledPresent('date')}
      onPickPresent={hiddenPresent ? undefined : () => handlePickPresent('date', '')}
      presentText="今天"
    />
  );

  if (pickScope === 'month') return (
    <CommonFooter
      disabledPresent={isDisabledPresent('month')}
      onPickPresent={hiddenPresent ? undefined : () => handlePickPresent('month', 'date')}
      presentText="当前月"
    />
  );

  if (pickScope === 'quarter') return (
    <CommonFooter
      disabledPresent={isDisabledPresent('quarter')}
      onPickPresent={hiddenPresent ? undefined : () => handlePickPresent('quarter', '')}
      presentText="当前季度"
    />
  );

  if (pickScope === 'year') return (
    <CommonFooter
      disabledPresent={isDisabledPresent('year')}
      onPickPresent={hiddenPresent ? undefined : () => handlePickPresent('year', mode === 'quarter' ? 'quarter' : 'month')}
      presentText="今年"
    />
  );

  return <></>;
}
