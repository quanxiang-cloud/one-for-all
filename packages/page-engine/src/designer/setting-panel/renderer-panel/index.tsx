import React, { useState } from 'react';
import cs from 'classnames';
import { observer } from 'mobx-react';

import { Icon, Modal } from '@ofa/ui';
import { useCtx } from '@ofa/page-engine';

import ModalBindIf from './modal-bind-if';
import ModalBindFor from './modal-bind-for';
import BindItem from './bind-item';

import styles from './index.m.scss';

interface Props {
  className?: string;
}

type ActionName='if' | 'for' | ''

function RendererPanel(props: Props): JSX.Element {
  const { page } = useCtx();
  const { activeElem } = page;
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<ActionName>('');

  return (
    <>
      <div className={styles.renderPanel}>
        <div className='mb-8'>
          <p>条件展示</p>
          <BindItem
            title='添加显隐规则'
            bound={!!activeElem._renderer?.if}
            onEdit={()=> {
              setModalOpen(true);
              setAction('if');
            }}
            onBind={()=> {
              setModalOpen(true);
              setAction('if');
            }}
            onUnbind={()=> {
              page.updateElemProperty(activeElem.id || '', '_renderer.if', '');
            }}
          />
        </div>
        <div>
          <p>循环展示</p>
          <BindItem
            title='添加 for 循环'
            bound={!!activeElem._renderer?.for}
            onEdit={()=> {
              setModalOpen(true);
              setAction('for');
            }}
            onBind={()=> {
              setModalOpen(true);
              setAction('for');
            }}
            onUnbind={()=> {
              page.updateElemProperty(activeElem.id || '', '_renderer.for', '');
            }}
          />
        </div>
      </div>
      {modalOpen && action === 'if' && <ModalBindIf onClose={setModalOpen}/>}
      {modalOpen && action === 'for' && <ModalBindFor onClose={setModalOpen}/>}
    </>

  );
}

export default observer(RendererPanel);
