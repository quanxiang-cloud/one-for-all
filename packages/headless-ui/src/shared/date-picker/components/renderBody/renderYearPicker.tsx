import React, { useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import cs from 'classnames';

interface Props {
  date: Dayjs;
  pickedDate?: Dayjs;
  onChange?: (date: Dayjs) => void;
  disabledDate?: (date: Date) => boolean;
};

export default function RenderYearPicker({
  date,
  pickedDate,
  onChange,
  disabledDate,
}: Props): JSX.Element {
  const years = useMemo(() => {
    const year = date.get('year');
    const startYear = year - year % 10;
    return (new Array(12).fill(1)).map((val, index) => ({
      value: startYear + index - 1,
      isDisabled: !!disabledDate?.(date.clone().set('year', startYear + index - 1).toDate())
    }));
  }, [date.year()]);
  
  function handleChangeYear(year: number): void {
    onChange?.(date.year(year));
  }

  return (
    <div className="ofa-pick-year">
      {years.map(({value, isDisabled}, index) => {
        if (isDisabled) {
          return (
            <span
              className="ofa-pick-item is-disabled"
              key={value}
            >{value}年</span>
          );
        }
        return (
          <span
            className={cs(
              'ofa-pick-item',
              dayjs().year() === value && 'is-today',
              pickedDate?.year() === value && 'is-selected',
              [0, years.length - 1].includes(index) && 'is-other-panel',
            )}
            key={value}
            onClick={() => handleChangeYear(value)}
          >{value}年</span>
        )
      })}
    </div>
  );
}
