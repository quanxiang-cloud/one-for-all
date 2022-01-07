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
  onChange?: (...args: any[])=> void;
}

function ButtonElem(props: Props): JSX.Element {
  const { title = '按钮' } = props;
  return (

    <Button {...props}>{title}</Button>
  );
}

export default ButtonElem;

