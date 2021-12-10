import React from 'react';
import { observer } from 'mobx-react';
import { get } from 'lodash';

import { useCtx } from '@ofa/page-engine/ctx';
import SourceElem from './source-elem';

import styles from './index.m.scss';

const categories: Array<{ label: string, value: Registry.Category }> = [
  { label: '布局组件', value: 'layout' },
  { label: '基础组件', value: 'basic' },
  { label: '表单组件', value: 'form' },
  { label: '高级组件', value: 'advanced' },
  { label: '其它', value: 'others' },
];

function PlatformComps(): JSX.Element {
  const { registry } = useCtx();

  return (
    <div className={styles.comps}>
      {categories.map(({ label, value }) => {
        const elems = get(registry.elements, value, []);
        if (!(Array.isArray(elems) && elems.length)) {
          return null;
        }

        return (
          <div className={styles.cate} key={value}>
            <div className={styles.title}>{label}</div>
            <div className={styles.elems}>
              {elems.map((elem: Registry.SourceElement<any>) => {
                if (elem.hidden) {
                  return null;
                }
                return (
                  <SourceElem {...elem} key={elem.name} />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default observer(PlatformComps);
