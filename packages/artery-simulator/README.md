# Artery Simulator

技术要点

- 渲染组件时，将其放入一个不影响布局的的 container 中，`display: contents`
  - 借助此 container 可以找到组件渲染的实际 DOM
  - 组件加载后，将其实际 DOM 缓存起来，卸载前将其删除
- 创建 `IntersectionObserver` 并对上述的 DOM 集合进行监听 (A)
  - 在 callback 中就可以获得 DOM 的 boundingClientRect
  - 可以使用 boundingClientRect 在组件上层渲染一个表示其位置和大小的 contour 元素
  - 在 contour 元素上实现点击选中、拖拽等功能
- 监听 mutation 和 resize 事件
  - 当上述事件发生后，需要重新执行步骤 A
