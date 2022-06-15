import React from 'react';
import { getStartYear } from '../../utils';

import { RenderHeaderProps } from '../datePickerPanel';
import CommonHeader from './commonHeader';
import { ArrowList } from './index';

export default function RenderDateHeader({
  panelDate,
  changePanelDate,
  ...props
}: RenderHeaderProps & ArrowList): JSX.Element {
  return (
    <CommonHeader
      hiddenArrow
      onSupperAdd={() => changePanelDate(panelDate.add(100, 'year'))}
      onSuperSubtract={() => changePanelDate(panelDate.subtract(100, 'year'))}
      {...props}
    >
      <span>{getStartYear(panelDate, 'century')}-{getStartYear(panelDate, 'century') + 99}</span>
    </CommonHeader>
  );
}
