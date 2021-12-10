import React, { useState } from 'react';
import cs from 'classnames';
import { noop } from 'lodash';

import { Icon, Button, Modal } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine/ctx';

import styles from './index.m.scss';

type PreviewMode = 'pc' | 'mobile';

const Divider = (): JSX.Element => <div className='w-1 h-20 bg-gray-200 mx-16' />;

function Toolbar(): JSX.Element {
  const [viewMode, setViewMode] = useState<PreviewMode>('pc');
  const [openModal, setOpenModal] = useState(false);
  const { page } = useCtx();

  function handleSave(): void {
    page.saveSchema();
  }

  return (
    <div className={cs('bg-gray-50 h-44 flex justify-between items-center px-16', styles.toolbar)}>
      <div className={styles.brand}>qxp page engine</div>
      <div className={cs('flex items-center', styles.emulateBtns)}>
        <Icon name='computer' className='mr-20 cursor-pointer' color='gray' />
        <Icon name='phone_android' className='cursor-pointer' />
        <Divider />
        <Icon name='undo' className='mr-16 cursor-pointer' />
        <Icon name='redo' className='cursor-pointer' />
      </div>
      <div className={cs('flex items-center', styles.rightBtns)}>
        <Button iconName='preview' onClick={() => setOpenModal(true)}>预览</Button>
        <Divider />
        <Button iconName='save' modifier='primary' onClick={handleSave}>
          保存
        </Button>
      </div>
      {openModal && (
        <Modal
          title='预览页面'
          onClose={() => setOpenModal(false)}
          footerBtns={[{
            key: 'close',
            iconName: 'close',
            onClick: () => setOpenModal(false),
            text: '取消',
          }, {
            key: 'check',
            iconName: 'check',
            modifier: 'primary',
            onClick: noop,
            text: '确认',
          }]}
        >
          <pre className='px-10 py-10' style={{ minHeight: '100px' }}>
            {page.schema ? JSON.stringify(page.schema, null, 2) : <p>请拖拽构建页面</p>}
          </pre>
        </Modal>
      )}
    </div>
  );
}

export default Toolbar;
