import type { PropsSpec } from '@one-for-all/node-carve';

const manifest = {
  category: '基础组件',
  variants: [
    {
      icon: {
        type: 'platform',
        name: 'keyboard_arrow_right',
        initialProps: {},
      },
      desc: '面包屑用于展示层级',
      label: '面包屑',
      initialProps: {
        segments: [
          {
            key: 'key',
            text: 'level1',
          },
          {
            key: 'key2',
            text: 'level2',
          },
        ],
        separator: '/',
      },
    },
  ],
};

const propsSpec: PropsSpec = {
  props: [
    {
      label: '元素',
      name: 'segments',
      type: 'object',
      desc: '每一项可以设置text(文本），path（点击后跳转对应路径）属性',
    },
    {
      label: '分隔符',
      name: 'separator',
      type: 'string',
    },
    {
      label: "激活样式",
      name: "activeClass",
      type: "string",
      will: "ClassName"
    },
    {
      label: "segmentClass",
      name: "segmentClass",
      type: "string",
      will: "ClassName"
    },
    {
      label: "segmentStyle",
      name: "segmentStyle",
      type: "object",
      will: "StyleSheet"
    }
  ],
  isContainer: false,
  isOverLayer: false,
};

export default {
  key: 'Breadcrumb',
  manifest,
  propsSpec,
};
