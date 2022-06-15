import React, { useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import cs from 'classnames';

import { getDatesOfMonth, DateType } from '../../utils';

interface Props {
  date: Dayjs;
  pickedDate?: Dayjs;
  onChange?: (date: Dayjs) => void;
  disabledDate?: (date: Date) => boolean;
};

const WEEK_HEAD = ['日', '一', '二', '三', '四', '五', '六'];

export default function RenderDatePicker({
  date,
  pickedDate,
  onChange,
  disabledDate,
}: Props): JSX.Element {
  const dates = useMemo(() => {
    return getDatesOfMonth(date, disabledDate);
  }, [date.year(), date.month()]);
  
  function isSameDate(baseDate: Dayjs | undefined, { relativeMonth, value }: DateType): boolean {
    return !!baseDate?.isSame(date.add(relativeMonth, 'month').set('date', value), 'date');
  }

  function handleChangeDate(pickDate: DateType): void {
    onChange?.(date.add(pickDate.relativeMonth, 'month').date(pickDate.value));
  }

  return (
    <div className="ofa-pick-date">
      {WEEK_HEAD.map(value => (
        <span key={value}>{value}</span>
      ))}
      {dates.map((curDate) => {
        const { value, relativeMonth } = curDate;
        if (curDate.disabled) {
          return (
            <span
              className="ofa-pick-item is-disabled"
              key={`${value}${relativeMonth}`}
            >{value}</span>
          );
        }
        return (
          <span
            className={cs(
              'ofa-pick-item',
              isSameDate(dayjs(), curDate) && 'is-today',
              isSameDate(pickedDate, curDate) && 'is-selected',
              relativeMonth !== 0 && 'is-other-panel',
            )}
            key={`${value}${relativeMonth}`}
            onClick={() => handleChangeDate(curDate)}
          >{ value }</span>
        )
      })}
    </div>
  );
}
