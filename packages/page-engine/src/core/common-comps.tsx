import React from 'react';

import { Icon } from '@ofa/ui';

import styles from './index.m.scss';

export const PagePlaceholder = ()=> (
  <div className='flex flex-col items-center justify-center absolute w-full h-full'>
    <Icon name='pg-engine-empty' size={120} />
    <p className='text-gray-400 text-12'>开始构建页面，从左侧 组件库或模版库 面板中拖入元素</p>
  </div>
);

export const ContainerPlaceholder = ()=> (
  // todo: refine with tailwind
  <div className={styles.emptyContainer}>
    拖拽组件或模板到这里
  </div>
);
