import { PropsSpec } from '@one-for-all/node-carve';

const manifest = {
  category: '表单组件',
  variants: [
    {
      icon: {
        type: 'platform',
        name: 'calendar_today',
        initialProps: {},
      },
      desc: '可以选择日期',
      label: '日期选择器',
      initialProps: {},
    },
  ],
};

const propsSpec: PropsSpec = {
  props: [
    {
      label: '空白提示',
      name: 'placeholder',
      type: 'string',
    },
    {
      label: '默认值',
      name: 'defaultValue',
      type: 'object',
      will: 'DatePicker',
    },
    {
      label: '禁用',
      name: 'disabled',
      type: 'boolean',
    },
    {
      label: '隐藏当前日期跳转按钮',
      name: 'hiddenPresent',
      type: 'boolean',
    },
    {
      label: "浮层样式",
      name: "popupClassName",
      type: "string",
      will: "ClassName"
    },
    {
      label: "popupStyle",
      name: "popupStyle",
      type: "object",
      will: "StyleSheet"
    },
    {
      label: '返回值形式',
      name: 'format',
      type: 'function',
      willProps: {
        args: 'date',
        notes: '参数为选中时间的Date对象, 需要返回格式化后的字符串',
      },
    },
    {
      label: '设置禁止选中的时间',
      name: 'disabledDate',
      type: 'function',
      willProps: {
        args: 'date',
        notes:
          '参数为选中时间的Date对象, 根据需求返回布尔值, 例如不能选择当前日期之后的时间，return date.getTime() > Date.now()',
      },
    },
    {
      label: '显示隐藏事件',
      name: 'onOpenChange',
      type: 'function',
      willProps: {
        args: 'visible',
      },
    },
    {
      label: '选中变化事件',
      name: 'onChange',
      type: 'function',
      willProps: {
        args: 'date',
      },
    },
  ],
  isContainer: false,
  isOverLayer: false,
};

export default {
  key: 'DatePicker',
  manifest,
  propsSpec,
};
