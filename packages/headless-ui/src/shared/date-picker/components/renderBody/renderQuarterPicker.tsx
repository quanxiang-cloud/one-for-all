import React, { useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import cs from 'classnames';

import { getQuarterByMonth, getStartMonthOfQuarter, QuarterType } from '../../utils';

interface Props {
  date: Dayjs;
  pickedDate?: Dayjs;
  onChange?: (date: Dayjs) => void;
  disabledDate?: (date: Date) => boolean;
};

const QUARTER: QuarterType[] = ['Q1', 'Q2', 'Q3', 'Q4'];

export default function RenderQuarterPicker({
  date,
  pickedDate,
  onChange,
  disabledDate,
}: Props): JSX.Element {
  const quarter = useMemo(() => {
    return QUARTER.map(curQuarter => ({
      value: curQuarter,
      isDisabled: !!disabledDate?.(date.clone().set('month', getStartMonthOfQuarter(curQuarter)).toDate()),
    }));
  }, [date.year()]);

  function handleChangeMonth(quarter: QuarterType): void {
    const startMonth = getStartMonthOfQuarter(quarter);
    onChange?.(date.month(startMonth));
  }

  return (
    <div className="ofa-pick-quarter">
      {quarter.map(({ value, isDisabled }) => {
        if (isDisabled) {
          return (
            <span
              className="ofa-pick-item is-disabled"
              key={value}
            >{value}</span>
          );
        }
        return (
          <span
            className={cs(
              'ofa-pick-item',
              getQuarterByMonth(dayjs().month()) === value && 'is-today',
              pickedDate && getQuarterByMonth(pickedDate.month()) === value && 'is-selected',
            )}
            key={value}
            onClick={() => handleChangeMonth(value)}
          >{value}</span>
        );
      })}
    </div>
  );
}
