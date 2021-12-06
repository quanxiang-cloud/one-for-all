import React, { useState, useRef, useEffect } from 'react';

import TabNavs from './tab-navs';

import cs from 'classnames';

import './index.scss';

export type TabItem<T extends React.Key = string> = {
  id: T;
  name: string | React.ReactNode;
  content: React.ReactNode;
  state?: 'error' | 'warning';
  disabled?: boolean;
}

export type Props<T extends React.Key> = {
  items: TabItem<T>[];
  stretchNav?: boolean;
  separator?: boolean;
  className?: string;
  navsClassName?: string;
  navTitleClassName?: string;
  contentClassName?: string;
  style?: Record<string, unknown>;
  currentKey?: string | number;
  onChange?: (key: T) => void;
}

export default function Tab<T extends React.Key>({
  items,
  style,
  className,
  navsClassName,
  navTitleClassName,
  contentClassName,
  stretchNav,
  separator,
  currentKey,
  onChange,
}: Props<T>): JSX.Element {
  const navsRef = useRef(null);
  const [key, setKey] = useState<string | number>(currentKey || items[0].id);

  useEffect(()=> {
    setKey(currentKey || items[0].id);
  }, [currentKey]);

  const tabContentRender = (items: TabItem<T>[], key: string | number): React.ReactNode => {
    return items.find((item) => item.id === key)?.content;
  };

  const handleNavItemClick = ({ id, disabled }: any): void => {
    if (disabled) {
      return;
    }
    setKey(id);
    onChange?.(id);
  };

  return (
    <div
      style={style}
      className={cs('tab-wrapper', className)}
    >
      <TabNavs
        ref={navsRef}
        navs={items}
        currentKey={key}
        stretchNav={stretchNav}
        separator={separator}
        navsClassName={navsClassName}
        navTitleClassName={navTitleClassName}
        onClick={handleNavItemClick}
      />
      <div
        className={cs('tab-content', contentClassName)}
      >
        {tabContentRender(items, key)}
      </div>
    </div>
  );
}

Tab.TabNavs = TabNavs;
