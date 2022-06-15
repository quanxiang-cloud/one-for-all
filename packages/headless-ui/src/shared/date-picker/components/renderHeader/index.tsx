import React from 'react';

import { RenderHeaderProps } from '../datePickerPanel';
import { PickScope } from '../../utils';
import RenderDateHeader from './renderDateHeader';
import RenderMonthHeader from './renderMonthHeader';
import RenderYearHeader from './renderYearHeader';
import RenderCenturyHeader from './renderCenturyHeader';
import RenderTimeHeader from './renderTimeHeader';

export type ArrowList = {
  nextIcon?: React.ReactNode;
  prevIcon?: React.ReactNode;
  superNextIcon?: React.ReactNode;
  superPrevIcon?: React.ReactNode;
}

interface Props extends RenderHeaderProps {
  format?: string;
  timeAccuracy?: DatePickerTimeAccuracyType;
  pickScope: PickScope;
  onPickScopeChange: (mode: PickScope) => void;
}

export default function RenderHeader({
  pickScope,
  format,
  timeAccuracy,
  ...props
}: Props & ArrowList): JSX.Element {
  return (
    <>
      {pickScope === 'date' &&  <RenderDateHeader {...props} />}
      {['month', 'quarter'].includes(pickScope) &&  <RenderMonthHeader {...props} />}
      {pickScope === 'year' &&  <RenderYearHeader {...props} />}
      {pickScope === 'century' &&  <RenderCenturyHeader {...props} />}
      {pickScope !== 'time' && timeAccuracy &&  (
        <RenderTimeHeader format={format} timeAccuracy={timeAccuracy} {...props} />
      )}
    </>
  );
}
