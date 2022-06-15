import { PropsSpec } from '@one-for-all/node-carve';

const manifest = {
  category: '表单组件',
  variants: [
    {
      icon: {
        type: 'platform',
        name: 'access_time',
        initialProps: {},
      },
      desc: '可以选择时间',
      label: '时间选择器',
      initialProps: {
        timeAccuracy: "second"
      },
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
      will: 'TimePicker',
    },
    {
      label: '时间精度',
      name: 'timeAccuracy',
      type: 'string',
      will: 'Select',
      willProps: {
        options: [
          {
            label: '小时',
            value: 'hour',
          },
          {
            label: '分钟',
            value: 'minute',
          },
          {
            label: '秒',
            value: 'second',
          },
        ],
      },
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
      name: 'disabledTime',
      type: 'function',
      willProps: {
        args: 'type, time',
        notes:
          "参数为选中时间的类型以及具体数字，type包括 hour | minute | second,例如不能选择三点和五点 if (type === 'hour') return [3,5].includes(time);return false;",
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
  key: 'TimePicker',
  manifest,
  propsSpec,
};
