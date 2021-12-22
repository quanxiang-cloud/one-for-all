import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import cs from 'classnames';
import { observer } from 'mobx-react';
import Editor, { loader } from '@monaco-editor/react';
import { defaults } from 'lodash';

import { useCtx } from '@ofa/page-engine';
import { Modal, Icon, Button, toast } from '@ofa/ui';

import LayoutConfig from './layout-config';
import DisplayConfig from './display-config';
import BackgroundConfig from './background-config';
import FontConfig from './font-config';
import BorderConfig from './border-config';
import ShadowConfig from './shadow-config';
import { DEFAULT_STYLE_CONFIG, formatStyles } from './default-config';
import Section from '../../comps/section';

import styles from './index.m.scss';

interface Props {
  className?: string;
}

function StylePanel({ className }: Props): JSX.Element {
  const { register, getValues, setValue } = useForm();
  const { page } = useCtx();
  const [values, setValues] = useState<any>(defaults(page.activeElem._style || {}, DEFAULT_STYLE_CONFIG));
  const [modalOpen, setModalOpen] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    loader.config({ paths: { vs: '/dist/monaco-editor/vs' } });
  }, []);

  useEffect(() => {
    page.updateElemProperty(page.activeElem.id, '_style', values);
  }, [values]);

  function handleEditorMount(editor: any): void {
    editorRef.current = editor;
  }

  function getCurStyle(): React.CSSProperties {
    if (page.activeElem) {
      return page.activeElem._style || {};
    }
    return {};
  }

  function saveStyle(): void {
    const editorVal = editorRef.current.getValue();
    let styleVal;
    try {
      styleVal = JSON.parse(editorVal);
      console.log('final style: ', styleVal);
      page.updateElemProperty(page.activeElem.id, '_style', styleVal);
      setModalOpen(false);
    } catch (err: any) {
      toast.error(`错误的 CSS值，请填写 JSX 格式的 JSON object: ${err.message}`);
      return;
    }
  }

  if (!page.activeElem) {
    return (
      <div className='flex justify-center items-center flex-col h-full'>
        <p>当前层级没有内容</p>
        <p>请在左侧画布选中其他元素</p>
      </div>
    );
  }

  function handleFormChange(): void {
    const _values = getValues();
    const newValues = formatStyles(_values);
    setValues(newValues);
  }

  return (
    <div className={cs(styles.stylePanel, className)}>
      <div className='mb-8'>
        <Button className='flex items-center' onClick={() => setModalOpen(true)}>
          <Icon name='code' />源码编辑
        </Button>
      </div>
      <form onChange={handleFormChange}>
        <Section title='画布' defaultExpand>
          <LayoutConfig initValues={values} register={register} setValue={setValue} />
        </Section>
        <Section title='显示布局' defaultExpand>
          <DisplayConfig initValues={values} register={register} setValue={setValue} />
        </Section>
        <Section title='字体' defaultExpand>
          <FontConfig
            initValues={values}
            register={register}
            setValue={setValue}
            onFormChange={handleFormChange}
          />
        </Section>
        <Section title='背景' defaultExpand>
          <BackgroundConfig
            initValues={values}
            register={register}
            setValue={setValue}
            onFormChange={handleFormChange}
          />
        </Section>
        <Section title='边框' defaultExpand>
          <BorderConfig
            initValues={values}
            register={register}
            setValue={setValue}
            onFormChange={handleFormChange}
          />
        </Section>
        <Section title='阴影' defaultExpand>
          <ShadowConfig
            initValues={values}
            register={register}
            setValue={setValue}
            onFormChange={handleFormChange}
          />
        </Section>
      </form>

      {modalOpen && (
        <Modal
          title='编辑样式'
          onClose={() => setModalOpen(false)}
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
              onClick: saveStyle,
              text: '确认',
            },
          ]}
        >
          <Editor
            height={300}
            // lang=javascript
            language='css'
            theme='vs-dark'
            onMount={handleEditorMount}
            defaultValue={JSON.stringify(getCurStyle(), null, 2)}
          />
        </Modal>
      )}
    </div>
  );
}

export default observer(StylePanel);
