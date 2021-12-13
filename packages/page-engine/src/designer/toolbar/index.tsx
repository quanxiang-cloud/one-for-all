import React, { useState } from 'react';
import cs from 'classnames';
import { noop } from 'lodash';
import { observer } from 'mobx-react';

import { Icon, Button, Modal } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';

import styles from './index.m.scss';

const Divider = (): JSX.Element => <div className='w-1 h-20 bg-gray-200 mx-16' />;

function Toolbar(): JSX.Element {
  const [openModal, setOpenModal] = useState(false);
  const { page, designer } = useCtx();

  function handleSave(): void {
    page.saveSchema();
  }

  function saveAndExit(): void {
    page.saveSchema();
    history.back();
  }

  return (
    <div className={cs('bg-gray-50 h-44 flex justify-between items-center px-16', styles.toolbar)}>
      <div className={styles.brand}>{designer.pageTitle}</div>
      <div className={cs('flex items-center', styles.actions)}>
        <Icon name='computer' className='cursor-pointer' color='gray' />
        <Divider />
        <Icon name='undo' className='mr-16' clickable />
        <Icon name='redo' clickable />
        <Divider />
        <Icon name='help_doc' color='gray' clickable />
        <Divider />
        <Button iconName='preview' onClick={() => setOpenModal(true)}>预览</Button>
        <Divider />
        <Button iconName='save' onClick={handleSave} className={styles.btnSave}>保存</Button>
        <Button iconName='save' modifier='primary' onClick={saveAndExit}>保存并退出</Button>
      </div>
      {openModal && (
        <Modal
          title='预览页面'
          onClose={() => setOpenModal(false)}
          footerBtns={[
            {
              key: 'close',
              iconName: 'close',
              onClick: () => setOpenModal(false),
              text: '取消',
            },
            {
              key: 'check',
              iconName: 'check',
              modifier: 'primary',
              onClick: noop,
              text: '确认',
            },
          ]}
        >
          <pre className='px-10 py-10' style={{ minHeight: '100px' }}>
            {page.schema ? JSON.stringify(page.schema, null, 2) : <p>请拖拽构建页面</p>}
          </pre>
        </Modal>
      )}
    </div>
  );
}

export default observer(Toolbar);
