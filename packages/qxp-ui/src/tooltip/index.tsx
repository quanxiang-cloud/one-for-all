import React, { DetailedHTMLProps, HTMLAttributes, useRef, cloneElement } from 'react';

import Popper from '@c/popper';

import Tip from './tip';

export type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  position: 'left' | 'right' | 'top' | 'bottom';
  label: JSX.Element | string;
  children?: JSX.Element;
  labelClassName?: string;
  inline?: boolean;
  wrapperClassName?: string;
  always?: boolean;
}

const modifiers = [
  {
    name: 'offset',
    options: {
      offset: [0, 5],
    },
  },
];

export default function ToolTip(props: Props) {
  const {
    children, inline, always, position, ...otp
  } = props;
  const popperRef = useRef<Popper>(null);
  const reference = useRef<any>(null);

  return (
    <>
      {
        cloneElement(children as React.ReactElement, { ref: reference })
      }
      <Popper
        ref={popperRef}
        reference={reference}
        className='qxp-tooltip-container'
        placement={position || 'bottom-start'}
        modifiers={modifiers}
        trigger='hover'
      >
        <Tip
          {...otp}
        />
      </Popper>
    </>
  );
}
