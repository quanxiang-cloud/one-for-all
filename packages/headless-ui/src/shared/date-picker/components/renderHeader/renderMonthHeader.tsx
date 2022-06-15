import React from 'react';
import { PickScope } from '../../utils';

import { RenderHeaderProps } from '../datePickerPanel';
import CommonHeader from './commonHeader';
import { ArrowList } from './index';

interface Props extends RenderHeaderProps {
  onPickScopeChange: (mode: PickScope) => void;
}

export default function RenderMonthHeader({
  panelDate,
  changePanelDate,
  onPickScopeChange,
  ...props
}: Props & ArrowList): JSX.Element {
  return (
    <CommonHeader
      hiddenArrow
      onSupperAdd={() => changePanelDate(panelDate.add(1, 'year'))}
      onSuperSubtract={() => changePanelDate(panelDate.subtract(1, 'year'))}
      {...props}
    >
      <span
        className="ofa-date-picker-text-button"
        onClick={() => onPickScopeChange('year')}
      >{ panelDate.format('YYYY年') }</span>
    </CommonHeader>
  );
}
