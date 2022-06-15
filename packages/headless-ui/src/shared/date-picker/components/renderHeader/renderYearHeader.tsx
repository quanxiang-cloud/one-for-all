import React from 'react';
import { getStartYear, PickScope } from '../../utils';

import { RenderHeaderProps } from '../datePickerPanel';
import CommonHeader from './commonHeader';
import { ArrowList } from './index';

interface Props extends RenderHeaderProps {
  onPickScopeChange: (mode: PickScope) => void;
}

export default function RenderYearHeader({
  panelDate,
  changePanelDate,
  onPickScopeChange,
  ...props
}: Props & ArrowList): JSX.Element {
  return (
    <CommonHeader
      hiddenArrow
      onSupperAdd={() => changePanelDate(panelDate.add(10, 'year'))}
      onSuperSubtract={() => changePanelDate(panelDate.subtract(10, 'year'))}
      {...props}
    >
      <span
        className="ofa-date-picker-text-button"
        onClick={() => onPickScopeChange('century')}
      >{getStartYear(panelDate, 'ten_years')}-{getStartYear(panelDate, 'ten_years') + 9}</span>
    </CommonHeader>
  );
}
