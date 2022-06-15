import React from 'react';
import { PickScope } from '../../utils';

import { RenderHeaderProps } from '../datePickerPanel';
import CommonHeader from './commonHeader';
import { ArrowList } from './index';

interface Props extends RenderHeaderProps {
  onPickScopeChange: (mode: PickScope) => void;
}

export default function RenderDateHeader({
  panelDate,
  changePanelDate,
  onPickScopeChange,
  ...props
}: Props & ArrowList): JSX.Element {
  return (
    <CommonHeader
      onAdd={() => changePanelDate(panelDate.add(1, 'month'))}
      onSubtract={() => changePanelDate(panelDate.subtract(1, 'month'))}
      onSupperAdd={() => changePanelDate(panelDate.add(1, 'year'))}
      onSuperSubtract={() => changePanelDate(panelDate.subtract(1, 'year'))}
      {...props}
    >
      <span
        className="ofa-date-picker-text-button"
        onClick={() => onPickScopeChange('year')}
      >{ panelDate.format('YYYY年') }</span>
      <span
        className="ofa-date-picker-text-button"
        onClick={() => onPickScopeChange('month')}
      >{ panelDate.format('MM月') }</span>
    </CommonHeader>
  );
}
