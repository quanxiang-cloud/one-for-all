import React, { useState, useRef, useEffect } from 'react';
import cs from 'classnames';

import TabNavs from './tab-navs';

import './index.css';

export default function Tab<T extends React.Key>({
  items,
  style,
  className,
  direction = 'horizon',
  maxHeight,
  navsClassName,
  contentClassName,
  currentKey,
  onChange,
  children,
}: TabsProps<T>): JSX.Element {
  const navsRef = useRef(null);
  const [key, setKey] = useState<string | number>(currentKey || items[0].id);

  useEffect(() => {
    setKey(currentKey || items[0].id);
  }, [currentKey]);

  return (
    <div
      style={{ maxHeight, ...style }}
      className={cs(
        'ofa-tab-wrapper',
        {
          [`ofa-tab-direction__${direction}`]: direction,
        },
        className,
      )}
    >
      <TabNavs
        ref={navsRef}
        navs={items}
        currentKey={key}
        navsClassName={navsClassName}
        onClick={({ id, disabled }) => {
          if (disabled) return;
          setKey(id);
          onChange?.(id as T);
        }}
      />
      <div className={cs('ofa-tab-content', contentClassName)}>{children}</div>
    </div>
  );
}

export { TabNavs };
