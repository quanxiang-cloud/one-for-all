import React from 'react';

import { Button } from '@one-for-all/ui';

export interface Props {
  id?: string;
  title?: string;
  type?: 'button' | 'submit' | 'reset';
  size?: 'normal' | 'compact';
  modifier?: 'primary' | 'default' | 'danger';
  loading?: boolean;
  forbidden?: boolean;
  iconName?: string;
  iconSize?: number;
  textClassName?: string;
  iconClassName?: string;
  'data-node-key': string;
  style?: React.CSSProperties;
  onChange?: (...args: any[]) => void;
}

function ButtonElem({ title = '按钮', style, ...rest }: Props, ref: React.Ref<HTMLButtonElement>): JSX.Element {
  return (
    <Button {...rest} ref={ref} style={style}>{title}</Button>
  );
}

export default React.forwardRef(ButtonElem);

