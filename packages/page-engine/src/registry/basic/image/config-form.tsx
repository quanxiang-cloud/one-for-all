import React, { useContext, useEffect, useState } from 'react';
import { defaults, isEmpty } from 'lodash';

import { Select, Icon, Button } from '@ofa/ui';

import ctx from '../../../ctx';

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
  { label: '拉伸', value: 'fill' },
];

const defaultConfig = {
  imageUrl: '',
  fillMode: 'cover',
  preview: false,
  closeOnMaskClick: false,
};

function ConfigForm(): JSX.Element {
  const { page } = useContext(ctx);
  const [values, setValues] = useState<Props>(defaults(page.activeElem.props, defaultConfig));

  useEffect(() => {
    page.updateElemProps(page.activeElem.id, values);
  }, [values]);

  useEffect(() => {
    !isEmpty(page.activeElem.props) && setValues(defaults(page.activeElem.props, defaultConfig));
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
            onChange={(e) => {
              setValues({ ...values, imageUrl: e.target.value });
            }}
          />
          <Icon name="code" />
        </div>
        填充方式
        <div className="config-item">
          <Select
            className="my-8 w-full mr-4"
            options={fillOptions}
            value={values.fillMode}
            onChange={(value) => setValues({ ...values, fillMode: value })}
          />
          <Icon name="code" />
        </div>
        更多方式
        <div className="config-item">
          <div className="w-full rounded-8 px-16 py-8 flex items-center justify-between border-1 mr-8 my-8">
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
          <Icon name="code" />
        </div>
        <div className="config-item">
          <div className="w-full rounded-8 px-16 py-8 flex justify-between border-1 mr-8 mb-8">
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
          <Icon name="code" />
        </div>
      </div>
    </>
  );
}

export default ConfigForm;
