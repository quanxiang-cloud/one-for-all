import type { PropsSpec } from '@one-for-all/node-carve';

const manifest = {
  category: '高级组件',
  variants: [
    {
      icon: {
        type: 'platform',
        name: 'swap_horiz',
        initialProps: {},
      },
      desc: '轮播图片',
      label: '轮播图',
      initialProps: {
        images: [
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAABGNJREFUaEPtmksodVEUx/8XkYQiKWNSHokMDBBloAxMyMBjgFIeRZ5RngOJRAzkUZ7JxEAGHkleA/LIwMAjeYSBUkh5xP1a6+vc7+Lce8+Te+vbE3efs89/rd9aa+993bMN29vbRh8fH7i5ucER28vLC+7u7mA4PT010ofAwEB4e3s7FMv9/T1OTk5AiTBcXV0ZPTw8+IIjwQgQ5PPT09NfkICAAJjfsPfMfPX1+vr6HwjVlCPAiPn4DcTeYSwFWhTEXmGsVYtFEHuDsVXyVkHsBcYWBPlpE+S3YaRASAb5LRipELJAfhpGDoRskJ+CkQuhCERvGCUQikH0glEKoQpEaxg1EKpBtIJRC6EJiFoYLSA0A1EKoxWEpiByYbSE0BxEKozWELqA2ILRA0I3EEswekHoCvIVhvp6/rgh6Ws8OaG0CVmg5/X8heY/iJQMmc8Jhy0tsYntcJPdmsN6wWg+R6Q4KmWMlNI1H6MpiBwH5YyVAqUZiBLHlDxjCUoTEDUOqXlW09LSwhEtNFRlRAsHhKiq1VIMotawWK2r0VQEosagrRVIqbZsEKWGbAGY31diQxaIFAOPj4/sk6enpxzfv421ZMuSvmSQ7u5ulJaWfjLY1taGqqoqvvb6+or8/HyMjY1xPysrC0NDQ3B1dZUE1N/fj4KCgk9jm5qakJKSwl//3d3drepLAqHokNPLy8tYWloyGSMnXVxcuN/Z2cljdnZ28Pz8jKCgIHR0dKC8vFwSSF9fH8bHx7GwsPBJn97W0j9k8/PzoGBa0rcJIqR4dXUVMzMzDCPWQkNDkZmZidraWvT29qKkpAQhISE4ODjg4QMDA3h7e0NhYSH3u7q64Ovri+zsbO4TyNTUlKg++RAVFcX6zc3NovqSX71NTk6ivb0dqamp/E47KSkJ6enp7ITRaISTkxODJiYmIiIiAtXV1VwqHx8fMBgMWFtbQ3x8PDtC4ylbFP2YmBgTiC19ynpGRgbi4uK+6Ut+GbqxsYHZ2VmOzO3tLYqKijA4OIi8vDw8PDzwiQnK1ubmJkc+NjaWoSiaXl5e7CyVRXR0NH/e3d1FZGSkKblS9Mk+lRjpUSDN9RW/nqbap7KZm5vjqDs7O2N0dBSNjY3Y29vD4uIi0tLS8P7+ztmiv8XFxZienmbn6V5PTw/fE2uW9Ovr6zEyMoLz83Pk5OSY9BUfGKCM7O/vY319nf0IDg7G0dERT/qysjK0trZieHgYh4eHfL+mpgYTExNYWVnh0kpISOBVqKGhQRTEmn5ubi7q6uo4O8fHx/z8JxBLazcZbmlp4XKhOt/a2kJycjJPbHKQGtV8ZWUlzs7OuB8eHg6KXkVFhckQfaCjItQuLy95afb392cwufphYWFc1rREU1mbQGwdqqE9gSItbEi0+tByKCy/tI+QMC2h1OTuI0r0KfsXFxe8z/ChGjnHnG5ubuDn52cC+FoXand2ufpCFfExJ7GDZ7RkUsqF9rUvWti/dFE4ePYH03Hgqx/ojtsAAAAASUVORK5CYII=',
        ],
        defaultIndex: 0,
        disableAutoplay: false,
        autoplaySpeed: 3000,
        hideDots: false,
        fillMode: "cover",
      },
    },
  ],
};

const propsSpec: PropsSpec = {
  props: [
    {
      label: '图片路径',
      name: 'images',
      type: 'object',
      will: 'ImageUrlGroup',
    },
    {
      label: '填充方式',
      name: 'fillMode',
      type: 'string',
      will: 'Select',
      willProps: {
        options: [
          {
            label: '铺满',
            value: 'cover',
          },
          {
            label: '拉伸',
            value: 'contain',
          },
          {
            label: '适合',
            value: '100% 100%',
          },
        ],
      },
    },
    {
      label: '默认图片编号',
      name: 'defaultIndex',
      type: 'number',
      willProps: {
        min: 0,
      },
    },
    {
      label: '禁止自动播放',
      name: 'disableAutoplay',
      type: 'boolean',
    },
    {
      label: '自动播放速度',
      name: 'autoplaySpeed',
      type: 'number',
      desc: '单位：毫秒',
    },
    {
      label: '隐藏切换点',
      name: 'hideDots',
      type: 'boolean',
    },
    {
      label: '图片变化事件',
      name: 'onChange',
      type: 'function',
      willProps: {
        args: 'value',
      },
    },
  ],
  isContainer: false,
  isOverLayer: false,
};

export default {
  key: 'SwiperImage',
  manifest,
  propsSpec,
};
