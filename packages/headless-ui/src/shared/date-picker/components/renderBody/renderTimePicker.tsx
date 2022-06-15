import React, { useMemo, useRef, useEffect, useCallback, memo } from 'react';
import cs from 'classnames';
import dayjs, { Dayjs } from 'dayjs';

import { scrollTo } from '../../utils';

interface Props {
  timeAccuracy?: DatePickerTimeAccuracyType;
  pickedDate?: Dayjs;
  hasLeftBorder?: boolean;
  onChange?: (date: Dayjs) => void;
  disabledTime?: (type: DatePickerTimeAccuracyType, time: number) => boolean;
};

type PickerTimeColumnProps = {
  data: Array<{ value: number, isDisabled: boolean }>;
  pickedTime?: number;
  onChange: (curTime: number) => void;
};

const HOURS = new Array(24).fill(1).map((val, index) => index);
const MINUTES = new Array(60).fill(1).map((val, index) => index);
const SECONDS = [...MINUTES];

export default function RenderTimePicker({
  timeAccuracy,
  pickedDate,
  hasLeftBorder,
  onChange,
  disabledTime,
}: Props): JSX.Element {
  const { pickedHour, pickedMinute, pickedSecond } = useMemo(() => {
    return {
      pickedHour: pickedDate?.hour() || 0,
      pickedMinute: pickedDate?.minute() || 0,
      pickedSecond: pickedDate?.second() || 0,
    };
  }, [pickedDate]);

  const { hours, minutes, seconds } = useMemo(() => {
    return {
      hours: HOURS.map(hour => ({ value: hour, isDisabled: !!disabledTime?.('hour', hour) })),
      minutes: MINUTES.map(minute => ({ value: minute, isDisabled: !!disabledTime?.('minute', minute) })),
      seconds: SECONDS.map(second => ({ value: second, isDisabled: !!disabledTime?.('second', second) }))
    }
  }, [disabledTime]);

  function handleChange(type: DatePickerTimeAccuracyType, num: number) {
    onChange?.((pickedDate || dayjs().startOf('date')).set(type, num));
  }

  return (
    <div className={cs('ofa-pick-time-container', !hasLeftBorder && 'left-border-none')}>
      <PickerTimeColumn
        data={hours}
        pickedTime={pickedHour}
        onChange={(time) => handleChange('hour', time)}
      />
      {['minute', 'second'].includes(timeAccuracy || '') && (
        <PickerTimeColumn
          data={minutes}
          pickedTime={pickedMinute}
          onChange={(time) => handleChange('minute', time)}
        />
      )}
      {timeAccuracy === 'second' && (
        <PickerTimeColumn
          data={seconds}
          pickedTime={pickedSecond}
          onChange={(time) => handleChange('second', time)}
        />
      )}
    </div>
  );
}

function PickerTimeColumn({ data, pickedTime, onChange }: PickerTimeColumnProps) {
  const timeColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pickedTime && timeColumnRef.current) {
      const itemHeight = timeColumnRef.current.scrollHeight / data.length;
      scrollTo(timeColumnRef.current, itemHeight * pickedTime);
    }
  }, [pickedTime]);

  return (
    <div className="ofa-pick-time-column" ref={timeColumnRef}>
      {data.map(({ value, isDisabled }) => {
        return (
          <span
            key={value}
            className={cs(pickedTime === value && 'is-selected', isDisabled && 'is-disabled')}
            onClick={() => !isDisabled && onChange(value)}
          >{value}</span>
        )
      })}
    </div>
  );
};
