import React, { useEffect, useState } from 'react';
import { defaults, isEmpty } from 'lodash';

import { useCtx } from '@ofa/page-engine';
import { Select, Icon, Button } from '@ofa/ui';

import ConfigBind from '../../../designer/comps/config-item-bind';

import './style.scss';

interface Props {
  className?: string;
  imageUrl?: string;
  fillMode?: string;
  preview?: boolean;
  closeOnMaskClick?: boolean;
}

const fillOptions = [
  { label: '铺满', value: 'cover' },
  { label: '适合', value: 'contain' },
  { label: '拉伸', value: '100% 100%' },
];

const defaultConfig = {
  imageUrl: '',
  fillMode: 'cover',
  preview: false,
  closeOnMaskClick: false,
};

function ConfigForm(): JSX.Element {
  const { page } = useCtx();
  const [values, setValues] = useState<Props>(defaults(page.activeElemProps, defaultConfig));

  useEffect(() => {
    page.updateElemProperty(page.activeElem.id, 'props', values);
  }, [values]);

  useEffect(() => {
    !isEmpty(page.activeElem.props) && setValues(defaults(page.activeElemProps, defaultConfig));
  }, [page.activeElem.props]);

  return (
    <>
      <div>
        图片填充
        <div className="config-item">
          <input
            type="text"
            className="w-full h-32 my-8 px-16 truncate mr-8"
            value={values.imageUrl}
            onChange={(e) => setValues({ ...values, imageUrl: e.target.value })}
          />
          <ConfigBind name='imageUrl' />
        </div>
        填充方式
        <div className="config-item">
          <Select
            className="my-8 w-full mr-4"
            options={fillOptions}
            value={values.fillMode}
            onChange={(value) => setValues({ ...values, fillMode: value })}
          />
          <ConfigBind name='fillMode' />
        </div>
        更多方式
        <div className="config-item">
          <div className="config-more mt-8">
            <div className="flex items-center">
              <Icon name="pageview" className="mr-4" />
              点击预览大图
            </div>
            <Button
              className="h-24"
              modifier={values.preview ? undefined : 'primary'}
              onClick={() => setValues({ ...values, preview: !values.preview })}
            >
              {values.preview ? '关闭' : '开启'}
            </Button>
          </div>
          <ConfigBind name='preview' />
        </div>
        <div className="config-item">
          <div className="config-more">
            <div className="flex items-center">
              <Icon name="preview" className="mr-4" />
              点击遮罩关闭图片预览
            </div>
            <Button
              className="h-24"
              modifier={values.closeOnMaskClick ? undefined : 'primary'}
              onClick={() => setValues({ ...values, closeOnMaskClick: !values.closeOnMaskClick })}
            >
              {values.closeOnMaskClick ? '关闭' : '开启'}
            </Button>
          </div>
          <ConfigBind name='closeOnMaskClick' />
        </div>
      </div>
    </>
  );
}

export default ConfigForm;
