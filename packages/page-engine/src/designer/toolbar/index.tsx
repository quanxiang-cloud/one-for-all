import React, { useState } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import { Icon, Button } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';

import styles from './index.m.scss';

const Divider = (): JSX.Element => <div className='w-1 h-20 bg-gray-200 mx-16' />;

function Toolbar(): JSX.Element {
  const ctx = useCtx();
  const { page, designer } = ctx;

  function handleSave(): void {
    ctx.onSave?.(toJS(page.schema));
  }

  function saveAndExit(): void {
    handleSave();
    history.back();
  }

  function handlePreview(): void {
    ctx.onPreview?.(toJS(page.schema));
  }

  return (
    <div className={cs('bg-gray-50 h-44 flex justify-between items-center px-16', styles.toolbar)}>
      <div className={styles.brand}>{designer.vdoms.title}</div>
      <div className={cs('flex items-center', styles.actions)}>
        <Icon name='computer' className='cursor-pointer' color='gray' />
        <Divider />
        <Icon name='undo' className='mr-16' clickable />
        <Icon name='redo' clickable />
        <Divider />
        <Icon name='help_doc' color='gray' clickable />
        <Divider />
        <Button iconName='preview' onClick={handlePreview}>预览</Button>
        <Divider />
        <Button iconName='save' onClick={handleSave} className={styles.btnSave}>保存</Button>
        <Button iconName='save' modifier='primary' onClick={saveAndExit}>保存并退出</Button>
      </div>
    </div>
  );
}

export default observer(Toolbar);
