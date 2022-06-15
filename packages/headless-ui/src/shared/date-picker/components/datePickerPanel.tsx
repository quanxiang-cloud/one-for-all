import React, { useState } from 'react';
import { Dayjs } from 'dayjs';

import { getDate, PickScope } from '../utils';
 
export type RenderHeaderProps = { changePanelDate: (date: Dayjs) => void, panelDate: Dayjs };
export type RenderBodyProps = { changePick: (date: Dayjs) => void, confirmPick: (date?: Dayjs) => void, closePanel: () => void, panelDate: Dayjs, pickedDate?: Dayjs };
export type RenderFooterProps = { changePick: (date: Dayjs) => void, confirmPick: (date?: Dayjs) => void, closePanel: () => void };

interface Props {
  timeAccuracy?: DatePickerTimeAccuracyType;
  mode: PickScope;
  date?: Dayjs;
  onChangePicker?: (date: Dayjs | undefined) => void;
  onClose?: () => void;
  renderHeader?: (props: RenderHeaderProps) => JSX.Element;
  renderBody?: (props: RenderBodyProps) => JSX.Element;
  renderFooter?: (props: RenderFooterProps) => JSX.Element;
}

export default function DatePickerPanel({
  timeAccuracy,
  mode,
  date,
  onChangePicker,
  onClose,
  renderHeader,
  renderBody,
  renderFooter,
}: Props) {
  const [_date, setDate] = useState(date || getDate(mode, timeAccuracy));
  const [pickedDate, setPickedDate] = useState(date);

  function changePick(date: Dayjs): void {
    setDate(date);
    setPickedDate(date);
  }

  function confirmPick(date?: Dayjs): void {
    onChangePicker?.(date || pickedDate);
  }

  function closePanel(): void {
    onClose?.();
  }

  return (
    <div className="ofa-date-picker-panel">
      {renderHeader && <div className="ofa-date-picker-header">
        {renderHeader({
          changePanelDate: setDate,
          panelDate: _date,
        })}
      </div>}
      {renderBody && <div className="ofa-date-picker-body">
        {renderBody({
          changePick,
          confirmPick,
          closePanel,
          panelDate: _date,
          pickedDate,
        })}
      </div>}
      {renderFooter && <div className="ofa-date-picker-footer">
        {renderFooter({
          changePick,
          confirmPick,
          closePanel,
        })}
      </div>}
    </div>
  );
}
