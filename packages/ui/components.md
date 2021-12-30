
## typography: 定义组件中文字的 size, weight and color

todo define variables

$font-size-1: 40px/3rem;
$font-size-2: 20px/2rem;
$font-size-3: 10px/1rem;


.btn {
  font-size: $font-size-1;
}

## color: 定义全局可用的 color 变量

## 组件清单

- Button, both
- Icon, both
- Grid, both
- Divide, both
- Form, 纯逻辑, tbd
- Input, both
- Radio/RadioGroup, both
- Checkbox/CheckboxGroup, both
- Switch, both
- Select/Picker, web, mobile
- Cascader, web, mobile
- TreeSelect, web, mobile
- DatePicker, web, mobile
- Upload headless, both
- Upload UI, both
- Rate, tbd
- Slider, tbd
- Table, both
- Pagination, web
- Tabs, both
- Tag, both
- loading, both
- Drawer, web
- Toast/message, both
- Modal, web
- Popover(Popconfirm), web
- Pull Refresh, mobile
- Swiper, both
- List(on reach bottom load more), mobile
- NAV Bar, mobile
- breadcrumb, both

## web 和 mobile 组件适配方案

- 为 web 和 mobile 的组件分别构建
- 两者应该保持有相同的 export member
- 但是相同的 export member 会有不同的实现
- 可以在 import map 中控制加载的是 web 还是 mobile 的组件库
- web 和 mobile 组件使用两套样式

伪代码：

```

web:

- component 1, *
- component 2, *
- component 3: web

mobile:

- component 1, *
- component 2, *
- component 3: mobile

bundle:

- web:
  - ...common components
  - component 3: import from 'web-component-3'
- mobile:
  - ...common components
  - component 3: import from 'mobile-component-3'
---

dist/web/index.js
dist/mobile/index.js

import map
@ofa/ui@1.0.0: dist/web/index.js
@ofa/ui@1.0.0: dist/mobile/index.js

``
