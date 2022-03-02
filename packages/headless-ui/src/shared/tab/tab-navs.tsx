import React, { forwardRef } from 'react';

import cs from 'classnames';

function TabNavs<T extends React.Key>({
  navs,
  className,
  activeNavClassName,
  navsClassName,
  currentKey,
  onClick,
  style,
}: TabNavProps<T>,
  ref?: React.Ref<HTMLDivElement>): JSX.Element {
  return (
    <div className='ofa-tab-navs-wrapper'> {/* This layer of div is used to solve the overflow-x auto */}
      <div
        ref={ref}
        style={style}
        className={cs('ofa-tab-navs', className)}>
        {
          navs.map((item) => {
            const active = item.id === currentKey;
            return (
              <div
                key={item.id}
                onClick={() => onClick?.(item)}
                className={cs(
                  'cursor-pointer relative ofa-tab-nav-item',
                  {
                    disabled: item.disabled,
                    [`${activeNavClassName}`]: active,
                    [`tab-nav__${item.state}`]: item.state,
                  },
                  navsClassName,
                )}
              >
                {item.name}
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

export default forwardRef(TabNavs);
