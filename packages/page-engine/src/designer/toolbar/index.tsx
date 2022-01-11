import React, { useMemo, useState } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

import { Icon, Button, Tooltip, Modal } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';
import { SchemaRender, Schema } from '@ofa/render-engine';
import { isDev } from '../../utils';

import styles from './index.m.scss';

interface Props{
  docLink?: string;
  hideTestPreview?: boolean;
}

const Divider = (): JSX.Element => <div className='w-1 h-20 bg-gray-200 mx-16' />;

function Toolbar({ docLink = '', hideTestPreview }: Props): JSX.Element {
  const ctx = useCtx();
  const { page, designer, registry } = ctx;
  const [openTestPreview, setOpenPreview] = useState(false);
  const repository = useMemo(()=> ({
    'ofa-ui@latest': registry.toComponentMap(),
  }), []);

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
    // open new page
    const aElem = document.createElement('a');
    Object.assign(aElem, {
      href: location.href.replace(/\/page-design/, '/page-preview'),
      rel: 'noopener noreferrer',
      target: '_blank',
    });
    aElem.click();
  }

  function renderSchemaRender(): JSX.Element {
    const schema = toJS(page.schema);
    console.log('preview page schema: ', schema);

    return (
      <SchemaRender
        schema={schema as Schema}
        apiSpecAdapter={{} as any}
        repository={repository as any}
      />
    );
  }

  return (
    <div className={cs('bg-gray-50 h-44 flex justify-between items-center px-16', styles.toolbar)}>
      <div className={styles.brand}>{designer.vdoms.title}</div>
      <div className={cs('flex items-center', styles.actions)}>
        <Tooltip position='top' label='撤销'>
          <Icon name='undo' className='mr-16' clickable />
        </Tooltip>
        <Tooltip position='top' label='重做'>
          <Icon name='redo' clickable />
        </Tooltip>
        <Divider />
        <Tooltip position='top' label='点击前往查看如何使用页面设计器'>
          <a
            href={docLink}
            target='_blank'
            rel="noopener noreferrer"
          >
            <Icon name='help_doc' color='gray' clickable/>
          </a>
        </Tooltip>
        {isDev() && !hideTestPreview && (
          <>
            <Divider />
            <Tooltip position='top' label='测试预览'>
              <Icon name='eye-open' color='gray' clickable onClick={()=> setOpenPreview(true)}/>
            </Tooltip>
          </>
        )}
        <Divider />
        <Button iconName='preview' onClick={handlePreview}>预览</Button>
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
