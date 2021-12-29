import React, { useEffect, useMemo, useRef, useState } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import { Icon, Button, Tooltip, Modal } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';
import { SchemaRender, Schema, RenderEngineCTX } from '@ofa/render-engine';

import styles from './index.m.scss';

const Divider = (): JSX.Element => <div className='w-1 h-20 bg-gray-200 mx-16' />;

function Toolbar(): JSX.Element {
  const ctx = useCtx();
  const { page, designer, registry } = ctx;
  const [openTestPreview, setOpenPreview] = useState(false);
  const repository = useMemo(()=> ({
    'ofa-ui@latest': registry.toComponentMap(),
  }), []);
  const renderRef = useRef<RenderEngineCTX>();

  useEffect(()=>{
    if (renderRef.current) {
      // console.log('render ref: ', renderRef.current);
      if (renderRef.current.states) {
        // @ts-ignore
        const st = renderRef.current.states['text cont'];
        console.log('test state: ', st);
      }
    }
  }, [renderRef.current]);

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
    const renderSchema = toJS(page.schema);
    console.log('preview render schema: ', renderSchema);
    ctx.onSave?.(renderSchema, { draft: true, silent: true });
  }

  function renderSchemaRender(): JSX.Element {
    const schema = toJS(page.schema);
    console.log('preview page schema: ', schema);

    return (
      <SchemaRender
        schema={schema as Schema}
        apiSpecAdapter={{} as any}
        repository={repository as any}
        ref={renderRef}
      />
    );
  }

  return (
    <div className={cs('bg-gray-50 h-44 flex justify-between items-center px-16', styles.toolbar)} ref={renderRef}>
      <div className={styles.brand}>{designer.vdoms.title}</div>
      <div className={cs('flex items-center', styles.actions)}>
        <Icon name='computer' className='cursor-pointer' color='gray' />
        <Divider />
        <Icon name='undo' className='mr-16' clickable />
        <Icon name='redo' clickable />
        <Divider />
        <Icon name='help_doc' color='gray' clickable />
        <Divider />
        <Tooltip position='top' label='测试预览'>
          <Icon name='eye-open' color='gray' clickable onClick={()=> setOpenPreview(true)}/>
        </Tooltip>
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
      {openTestPreview && (
        <Modal
          title='测试预览'
          onClose={()=> setOpenPreview(false)}
          fullscreen
        >
          {renderSchemaRender()}
        </Modal>
      )}
    </div>
  );
}

export default observer(Toolbar);
