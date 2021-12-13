import React, { useState } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import { Select, RadioGroup, Radio } from '@ofa/ui';

import styles from './index.m.scss';

interface Props {
  className?: string;
}

function EventPanel({ className }: Props): JSX.Element {
  const [eventType, setType] = useState('platform');

  return (
    <div className={cs(styles.eventPanel, className)}>
      <div className='mb-8'>
        <p className='text-12 text-gray-600'>触发条件</p>
        <Select options={[]} />
      </div>
      <div className='mb-8'>
        <p className='text-12 text-gray-600'>动作类型</p>
        <RadioGroup onChange={(val) => setType(val as string)}>
          <Radio label='平台方法' value='platform' defaultChecked={eventType === 'platform'} />
          <Radio label='自定义方法' value='custom' defaultChecked={eventType === 'custom'} />
        </RadioGroup>
      </div>
      <div className='mb-8'>
        <p className='text-12 text-gray-600'>执行动作</p>
        <Select options={[]} />
      </div>
    </div>
  );
}

export default observer(EventPanel);
