import React, { Children } from 'react';
import cs from 'classnames';

import Icon from '../icon';

import styles from './index.m.scss';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function Page({ className, style, children }: Props): JSX.Element {
  return (
    <div className={cs(styles.page, className)} style={style}>
      {!Children.count(children) && (
        <div className='flex flex-col items-center justify-center absolute w-full h-full'>
          <Icon name='pg-engine-empty' size={120} />
          <p className='text-gray-400 text-12'>开始构建页面，从左侧 组件库或模版库 面板中拖入元素</p>
        </div>
      )}
      {children}
    </div>
  );
}

export default Page;
