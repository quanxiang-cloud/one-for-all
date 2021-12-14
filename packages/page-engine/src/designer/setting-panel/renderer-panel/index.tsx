import React from 'react';
import cs from 'classnames';

import { Icon } from '@ofa/ui';
import Section from '../../comps/section';

import styles from './index.m.scss';

interface Props {
  className?: string;
}

function RendererPanel(props: Props): JSX.Element {
  return (
    <div className={styles.renderPanel}>
      <Section title='生命周期' defaultExpand>
        <div className='mb-8'>
          <p>条件展示</p>
          <div className={cs('flex justify-center items-center py-6 cursor-pointer', styles.btnAdd)}>
            <Icon name='add' />
            <span>添加显隐规则</span>
          </div>
        </div>
        <div>
          <p>循环展示</p>
          <div className={cs('flex justify-center items-center py-6 cursor-pointer', styles.btnAdd)}>
            <Icon name='add' />
            <span>添加 for 循环</span>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default RendererPanel;
