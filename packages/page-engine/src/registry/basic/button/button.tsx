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
  'data-node-key': string;
  style?: React.CSSProperties;
  onChange?: (...args: any[])=> void;
}

function ButtonElem(props: Props, ref: React.Ref<HTMLButtonElement>): JSX.Element {
  const { title = '按钮' } = props;
  return (

    <Button {...props} ref={ref} style={props.style}>{title}</Button>
  );
}

export default React.forwardRef(ButtonElem);

