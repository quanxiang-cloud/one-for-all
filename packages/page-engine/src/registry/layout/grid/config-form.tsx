import React, { useEffect, useState } from 'react';
import { defaults } from 'lodash';

import { Select, GridProps } from '@one-for-all/ui';
import { useCtx } from '../../../index';

export const defaultConfig: GridProps = {
  colRatio: '12:9:3',
  colGap: '8px',
};

const ratios = ['12', '6:6', '4:4:4', '3:3:3:3', '2:2:2:2:2:2'].map((value) => ({ label: value, value }));
const gaps = ['8px', '12px', '16px', '20px'].map((value) => ({ label: value, value }));

function ConfigForm(): JSX.Element {
  const { page } = useCtx();
  const [values, setValues] = useState<GridProps>(defaults(page.activeElemProps, defaultConfig));

  useEffect(() => {
    page.updateElemProperty(page.activeElem.id, 'props', values);
  }, [values]);

  useEffect(() => {
    setValues(page.activeElemProps);
  }, [page.activeElemId]);

  return (
    <form className='flex flex-col'>
      <div className='mb-8'>
        <p>栅格比例</p>
        <Select
          name='colRatio'
          options={ratios}
          value={values.colRatio}
          onChange={(colRatio: string) => setValues((prev) => ({ ...prev, colRatio }))}
        />
      </div>
      <div>
        <p>列间距</p>
        <Select
          name='colGap'
          options={gaps}
          value={values.colGap}
          onChange={(colGap: string) => setValues((prev) => ({ ...prev, colGap }))}
        />
      </div>
    </form>
  );
}

export default ConfigForm;
