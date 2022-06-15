import React, { useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import cs from 'classnames';

interface Props {
  date: Dayjs;
  pickedDate?: Dayjs;
  onChange?: (date: Dayjs) => void;
  disabledDate?: (date: Date) => boolean;
};

const MONTH = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export default function RenderMonthPicker({
  date,
  pickedDate,
  onChange,
  disabledDate,
}: Props): JSX.Element {
  const month = useMemo(() => {
    return MONTH.map(curMonth => ({
      value: curMonth,
      isDisabled: !!disabledDate?.(date.clone().set('month', curMonth).toDate())
    }));
  }, [date.year()]);

  function handleChangeMonth(month: number): void {
    onChange?.(date.month(month));
  }

  function isSameMonth(baseDate: Dayjs | undefined, month: number): boolean {
    return !!baseDate?.isSame(date.clone().month(month), 'month');
  }

  return (
    <div className="ofa-pick-month">
      {month.map(({ value, isDisabled }) => {
        if (isDisabled) {
          return (
            <span
              className="ofa-pick-item is-disabled"
              key={value}
            >{value + 1}月</span>
          );
        }
        return (
          <span
            className={cs(
              'ofa-pick-item',
              isSameMonth(dayjs(), value) && 'is-today',
              isSameMonth(pickedDate, value) && 'is-selected',
            )}
            key={value}
            onClick={() => handleChangeMonth(value)}
          >{value + 1}月</span>
        )
      })}
    </div>
  );
}
