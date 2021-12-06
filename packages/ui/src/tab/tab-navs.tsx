import React, { forwardRef } from 'react';

import cs from 'classnames';

import { TabItem } from './index';

import './index.scss';

type Props<T extends React.Key> = {
  navs: TabItem<T>[];
  currentKey: string | number;
  stretchNav?: boolean;
  separator?: boolean;
  navTitleClassName?: string;
  navsClassName?: string;
  onClick?: (item: TabItem<T>) => void;
}
function TabNavs<T extends React.Key>({
  navs,
  currentKey,
  stretchNav,
  separator,
  navTitleClassName,
  navsClassName,
  onClick,
}: Props<T>,
ref?: React.Ref<HTMLDivElement>): JSX.Element {
  return (
    <div className='z-10'> {/* This layer of div is used to solve the overflow-x auto */}
      <div
        ref={ref}
        className={cs('tab-navs', navsClassName)}>
        {
          navs.map((item) => {
            const active = item.id === currentKey;
            return (
              <div
                key={item.id}
                onClick={() => onClick?.(item)}
                className={cs(
                  'cursor-pointer relative tab-nav-item',
                  {
                    disabled: item.disabled,
                    'tab-nav-item-separator': separator,
                    'stretch-navs': stretchNav,
                    'active text-blue-600': active,
                    [`tab-nav__${item.state}`]: item.state,
                  },
                  navTitleClassName,
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
