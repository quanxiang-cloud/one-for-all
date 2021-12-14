import React from 'react';
import cs from 'classnames';

import { Icon } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';

import styles from './index.m.scss';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function Page({ className, style, children }: Props): JSX.Element {
  const { schema } = useCtx().page;

  return (
    <div className={cs(styles.page, className)} style={style}>
      {!schema.children?.length && (
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
