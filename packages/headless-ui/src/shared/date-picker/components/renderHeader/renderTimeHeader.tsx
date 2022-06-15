import React, { useMemo } from 'react';
import dayjs from 'dayjs';

import { RenderHeaderProps } from '../datePickerPanel';

interface Props extends RenderHeaderProps {
  format?: string;
  timeAccuracy?: DatePickerTimeAccuracyType;
}

export default function RenderMonthHeader({
  format,
  panelDate,
  timeAccuracy,
}: Props): JSX.Element {
  const formatTime = useMemo(() => {
    if (format) return format;
    if (!timeAccuracy) return 'HH:mm:ss';
    return {
      'hour': 'HH',
      'minute': 'HH:mm',
      'second': 'HH:mm:ss',
    }[timeAccuracy]
  }, [timeAccuracy, format]);

  function formatPickedTime(): string {
    const date = panelDate || dayjs().startOf('date');
    return date.format(formatTime);
  }

  return (
    <div className="ofa-pick-time-header">{formatPickedTime()}</div>
  );
}
