# Artery Simulator

技术要点

- wrap every node in a element, which `display: contents`, so the wrapped element looks like no exist
- IntersectionObserver node position, register it, used to render a mirror element
- implement drag and drop on mirror element
- the real node could be rendered as really as possible

- Simulator render artery structure, but not interactive
- Simulator tell you the clicked node position
- Simulator zoom in?

## TODO

- 优化性能
- dragging handle
- 优化 `请拖拽组件到此处` 的提示
- 点击 placeholder 需要可以选中父容器
- bug: drag hover child node
- todo: test composed and loop node
- 支持模态框
  - root layer
  - modal layer 1
  - modal layer 2
  - 组件是否属于 modal layer 需要被动推出
  - 所以应该定义 modal layer array state，当 artery 变化，有新 node 需要 render 时，push new modal layer 到数组中
