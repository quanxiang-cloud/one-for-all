import React, { useCallback, useState } from 'react';
import { observer } from 'mobx-react';
import Editor from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

import { Icon, Modal } from '@ofa/ui';

import Section from '../../../designer/comps/section';
import styles from './index.m.scss';

interface Props {
  className?: string;
}

type ActionName='willMount' | 'didMount' | 'willUnmount' | ''

const titleMap: Record<string, string> = {
  willMount: '页面加载之前',
  didMount: '页面加载完成时',
  willUnmount: '页面关闭时',
};

function ConfigForm(props: Props): JSX.Element {
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<ActionName>('');
  const getDefaultCode = ()=> {
    if (action === 'willMount') {
      return 'function willMount() {\n\t//\n}';
    }
    if (action === 'didMount') {
      return 'function didMount() {\n\t//\n}';
    }
    if (action === 'willUnmount') {
      return 'function willUnmount() {\n\t//\n}';
    }
    return '';
  };

  return (
    <div>
      <Section title='生命周期' defaultExpand>
        <div className='mb-8'>
          <p>页面加载之前执行</p>
          <div className={styles.btnAdd} onClick={()=> {
            setModalOpen(true);
            setAction('willMount');
          }}>
            <Icon name='add' />
            <span>绑定动作</span>
          </div>
        </div>
        <div className='mb-8'>
          <p>页面加载完成时</p>
          <div className={styles.btnAdd} onClick={()=> {
            setModalOpen(true);
            setAction('didMount');
          }}>
            <Icon name='add' />
            <span>绑定动作</span>
          </div>
        </div>
        <div>
          <p>页面关闭时</p>
          <div className={styles.btnAdd} onClick={()=> {
            setModalOpen(true);
            setAction('willUnmount');
          }}>
            <Icon name='add' />
            <span>绑定动作</span>
          </div>
        </div>
      </Section>
      {modalOpen && (
        <Modal
          title={`${titleMap[action]}: 绑定动作`}
          width={1200}
          height={600}
          onClose={()=> setModalOpen(false)}
          footerBtns={[
            {
              key: 'close',
              iconName: 'close',
              onClick: () => setModalOpen(false),
              text: '取消',
            },
            {
              key: 'check',
              iconName: 'check',
              modifier: 'primary',
              onClick: () => {
                //
              },
              text: '绑定动作',
            },
          ]}
        >
          <div className={styles.modal}>
            <div className={styles.side}>
              <div className='flex justify-between items-center cursor-pointer px-16 py-4 hover:bg-gray-200 bg-gray-200'>
                <span>添加新动作</span>
                <Icon name='check' />
              </div>
            </div>
            <div className={styles.body}>
              <Editor
                value={getDefaultCode()}
                height="480px"
                extensions={[javascript()]}
                onChange={(value) => {
                  console.log('value:', value);
                }}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default observer(ConfigForm);
