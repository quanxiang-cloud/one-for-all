import { PropsSpec } from '@one-for-all/node-carve';

const manifest = {
  category: '基础组件',
  variants: [
    {
      icon: {
        type: 'platform',
        name: 'chat_bubble',
        initialProps: {},
      },
      label: '基础模态框',
      desc: '在模态层中展示内容',
      initialProps: {
        isOpen: false,
      },
    },
  ],
};

const propsSpec: PropsSpec = {
  isContainer: true,
  isOverLayer: true,
  props: [
    {
      label: '是否显示',
      name: 'isOpen',
      type: 'boolean',
    },
    {
      label: '确认按钮动作',
      name: 'onOk',
      type: 'function',
    },
    {
      label: '取消按钮动作',
      name: 'onClose',
      type: 'function',
    },
    {
      label: '确认按钮文字',
      name: 'okBtnText',
      type: 'string',
    },
    {
      label: '取消按钮文字',
      name: 'cancelBtnText',
      type: 'string',
    },
  ],
};

export default {
  key: 'MediocreDialog',
  manifest,
  propsSpec,
};
