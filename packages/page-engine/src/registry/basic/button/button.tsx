import React from 'react';

import { Button } from '@ofa/ui';

export interface Props {
  title?: string;
  size?: 'normal' | 'compact';
  modifier?: 'primary' | 'danger';
  loading?: boolean;
  forbidden?: boolean;
  iconName?: string;
  iconSize?: number;
  textClassName?: string;
  iconClassName?: string;
  style?: React.CSSProperties;
}

function ButtonElem(props: Props, ref: any): JSX.Element {
  const { title = '按钮' } = props;
  return (

    <Button {...props} ref={ref} style={props.style}>{title}</Button>
  );
}

export default React.forwardRef(ButtonElem);

