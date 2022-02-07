import React from 'react';
import cs from 'classnames';

import { Icon } from '@one-for-all/ui';

import styles from './index.m.scss';

export interface GroupProps {
  icon: string;
  name: string;
  label: string;
  className?: string;
  active?: boolean;
  onHover?: () => void;
}

function Group(props: GroupProps): JSX.Element {
  return (
    <div
      className={cs('flex flex-col items-center mb-20 cursor-pointer', {
        [styles.active]: props.active,
      }, styles.group, props.className)}
      // onMouseOver={props.onHover}
      onClick={props.onHover}
    >
      <Icon name={props.icon} color='gray' clickable changeable />
      <p className='text-gray-600 text-10'>{props.label}</p>
    </div>
  );
}

export default Group;
