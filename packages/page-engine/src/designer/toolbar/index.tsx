import React from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import { Icon, Button } from '@ofa/ui';
import { useCtx, toRenderSchema } from '@ofa/page-engine';

import styles from './index.m.scss';

const Divider = (): JSX.Element => <div className='w-1 h-20 bg-gray-200 mx-16' />;

function Toolbar(): JSX.Element {
  const ctx = useCtx();
  const { page, designer } = ctx;

  function handleSave(): void {
    const pageSchema = toJS(page.schema);
    console.log('save page schema: ', pageSchema);
    ctx.onSave?.(pageSchema);
  }

  function saveAndExit(): void {
    handleSave();
    history.back();
  }

  function handlePreview(): void {
    // todo: revert
    const renderSchema = toRenderSchema(toJS(page.schema));
    console.log('preview render schema: ', renderSchema);
    ctx.onSave?.(renderSchema, { draft: true, silent: true });
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
        <Button iconName='preview' onClick={handlePreview}>
          <a
            href={location.href.replace(/\/page-design/, '/page-preview')}
            target='_blank'
            rel="noopener noreferrer"
          >
            预览
          </a>
        </Button>
        <Divider />
        <Button iconName='save' onClick={handleSave} className={styles.btnSave}>保存</Button>
        <Button iconName='save' modifier='primary' onClick={saveAndExit}>保存并退出</Button>
      </div>
    </div>
  );
}

export default observer(Toolbar);
