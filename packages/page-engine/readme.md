qxp page engine
===

## 项目结构

```
 |- core (核心库)
 |- registry (平台组件库，未来迁移到单独的repo)
 |- designer (设计器)
  |- toolbar (工具栏)
  |- setting-panel (设置面板)
  |- source-panel (源面板)
    |- custom-template (区块模板)
    |- data-source (数据源管理)
    |- page-tree (页面层级)
    |- platform-comps (平台组件面板)
 |- stores (全局状态)
 |- styles (样式)
 |- utils (工具函数)
 |- ctx.ts (全局context)
```

## Usage

```bash
// 安装依赖
yarn

// build dist
yarn run bundle

```

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

- 工具栏
    - undo/redo
    - 预览
    - 保存页面schema
- 侧导航面板
    - 组件库
        - 基础组件
        - 布局组件
        - 表单组件
    - 区块模板(自定义模板)
    - 页面层级(组件树)
    - 数据源绑定(基础变量，api变量)
- 属性面板
    - 组件属性
    - 样式
    - 事件
    - 动态渲染(if, for 渲染)

## License

MIT
