import React, { useEffect, useState, useRef } from 'react';
import { defaults, isEmpty } from 'lodash';

import { useCtx, DataBind as ConfigBind } from '../../../index';
import { Select, Icon, Button, Popper } from '@one-for-all/ui';

import './style.scss';

interface Props {
  id?: string;
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

export const DEFAULT_CONFIG = {
  imageUrl: '',
  fillMode: 'cover',
  preview: false,
  closeOnMaskClick: false,
};

function ConfigForm(): JSX.Element {
  const { page, designer } = useCtx();
  const [values, setValues] = useState<Props>(defaults(page.activeElemProps, DEFAULT_CONFIG));
  const popperRef = useRef<Popper>(null);
  const reference = useRef<any>(null);

  useEffect(() => {
    page.updateElemProperty(page.activeElem.id, 'props', values);
  }, [values]);

  // useEffect(() => {
  //   !isEmpty(page.activeElemProps) && setValues(defaults(page.activeElemProps, defaultConfig));
  // }, [page.activeElemProps]);

  useEffect(() => {
    setValues(page.activeElemProps);
  }, [page.activeElemId]);

  useEffect(() => {
    if (designer.imageUrl) {
      popperRef.current?.close();
      setValues({
        ...values,
        imageUrl: designer.imageUrl,
      });
      designer.setUploadImage('');
    }
  }, [designer.imageUrl]);

  return (
    <>
      <div className='mb-8'>
        <label className='mr-4 text-12 text-gray-600'>ID</label>
        <div className='flex items-center justify-between'>
          <input
            type="text"
            className='mr-8 px-8 py-4 w-full border corner-2-8-8-8 border-gray-300 focus:border-blue-600'
            value={values.id}
            onChange={(e) => setValues({ ...values, id: e.target.value })}
          />
          <ConfigBind name='id' />
        </div>
      </div>
      <div>
        图片填充
        <div className="config-item">
          <div className='mr-8 flex-1 relative'>
            <input
              type="text"
              className="w-full h-32 my-8 px-16 truncate border border-gray-300 corner-2-8-8-8"
              value={values.imageUrl}
              onChange={(e) => setValues({ ...values, imageUrl: e.target.value })}
            />
            <div
              ref={reference}
              className='absolute cursor-pointer'
              style={{ top: 15, right: 5 }}
            ><Icon name='upload_file' /></div>
          </div>
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
      <Popper ref={popperRef} reference={reference} trigger="click">
        <div
          className='p-10 bg-white border-2 border-gray-100'
          style={{ width: 400, height: 200 }}
        >
          <div className='w-full h-full flex items-center
            justify-center border border-dashed border-gray-100'>
            {designer.vdoms.uploadImage}
          </div>
        </div>
      </Popper>
    </>
  );
}

export default ConfigForm;
