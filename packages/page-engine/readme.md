qxp page engine
===

## 项目结构

```
 |- core (核心库)
 |- registry (平台组件库)
 |- designer (设计器)
 |- custom-elem (区块模板)
 |- page-tree (页面层级)
 |- data-source (数据源)
 |- stores (全局状态)
 |- settings (设置面板)
    |- attrs (属性设置)
    |- styles (样式设置)
    |- events (事件设置)
    |- dynamic-render (动态渲染)
```

## Todos

- 页面大纲树
- 组件库
    - 定义组件接口
    - 注册外部组件(对应组件库的组件，用户扩展的组件，用于页面搭建)
- 组件属性面板
- 组件样式面板
- 组件高级设置

## 目标

- 可视化拖拽搭建
- 页面模板平台无关 (json DSL)
- 内置组件库
- 区块模板(平台模板，自定义模板)
- 页面层级预览
- 组件的属性配置
    - 属性
    - 样式
    - 事件
    - 动态渲染
- 支持数据源绑定
- 支持外部API调用

## 一期规划

### 原型验证

- [x] 调研阿里宜搭
- [x] 验证 page engine的基础构建单元 wrapperNode
- [x] 确定 wrapperNode 的数据结构
- [x] 编写 serializer/deserializer 处理 page schema
- [x] 搭建mono repo，page engine 作为独立的pkg
- [ ] 迁移qxp-web的部分基础组件

### 功能划分

- 工具栏
    - 设备模拟 (pc/mobile)
    - undo/redo
    - zoom in/zoom out
    - 预览
    - 保存页面模板
- 侧导航控件面板
    - 组件库
        - 基础组件
        - 布局组件
        - 表单组件
    - 区块模板(自定义模板)
    - 页面层级(组件树)
    - 数据源绑定
- 属性面板
    - 数据
    - 样式
    - 事件
    - 动画

## 状态管理

需要支持 undo/redo，需要状态的 time travel，首先考虑的是 redux, mobx-state-tree

- redux（支持 time travel）
- mobx (不支持 time travel)
- mobx-state-tree (支持 time travel, snapshot)
- rxjs (需demo验证)
- recoil (支持time travel) https://recoiljs.org/zh-hans/docs/introduction/core-concepts

## License

MIT
