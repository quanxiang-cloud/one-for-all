import React, { useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import cs from 'classnames';

interface Props {
  date: Dayjs;
  pickedDate?: Dayjs;
  onChange?: (date: Dayjs) => void;
};

export default function RenderCenturyPicker({
  date,
  pickedDate,
  onChange,
}: Props): JSX.Element {
  const years = useMemo(() => {
    const year = date.year();
    const startYear = year - year % 100;
    return (new Array(12).fill(1)).map((val, index) => startYear + (index - 1) * 10);
  }, [date.year()]);

  const pickedYear = useMemo(() => pickedDate?.year(), [pickedDate?.year()]);

  function toFloorTen(num: number | undefined): number {
    if (!num) return 0;
    return Math.floor(num / 10) * 10;
  }
  
  function handleChangeTenYear(startYear: number): void {
    onChange?.(date.year(startYear));
  }

  return (
    <div className="ofa-pick-century">
      {years.map((startYear, index) => (
        <span
          className={cs(
            'ofa-pick-item',
            toFloorTen(dayjs().year()) === startYear && 'is-today',
            toFloorTen(pickedYear) === startYear && 'is-selected',
            [0, years.length - 1].includes(index) && 'is-other-panel',
          )}
          key={startYear}
          onClick={() => handleChangeTenYear(startYear)}
        >{startYear}-{startYear + 9}</span>
      ))}
    </div>
  );
}
