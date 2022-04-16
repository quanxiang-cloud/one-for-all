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

- mock init api state function，这样在 debug 模式下可以让用户操作页面，但不发请求？


## 备忘

- 使用 dnd-kit 需要在外层加一层 context，特别讨厌，但是 dnd-kit 的 storybook 很赞
- drop and drop 推荐使用标准的 data transfer 来实现
- 需要为组件库提供一个 drag 的 hook (未来可以支持上传图片)
- 对于 drop 事件
  - 需要判断组件是否支持 children，一般之前有的就支持，这就需要思民那边提供 util 方法了，且 children 需要是 react node 才可以
    - 需要和 config form 同步一下
  - drop 事件相对好处理
- 对于 drag 事件呢？
  - 同级别内调整顺序
  - 跨层级调整顺序
  - 只有这两种情况吧
  - drag 可以只考虑左右的情况，不用考虑上线
  - 可是使用 element-radar，在 drag 开始的瞬间获取所有元素的 rect
  - drag 事件可以知道鼠标位置，和 rect 做相对计算
    - 排除自己
    - 获取当前位置的 first parent，就是在某个元素的 react 内，且面积最小
      - 如果当前的 first parent 就是 drag element 本来的 parent 则忽略，且进入下面的判断
        - A: 获取同级及以下所有 nodes，进行移动到左右或者移动到内部的判断
      - 否则始终高亮 first parent，且重复 A 步骤

## 组件渲染结果分析

- html 组件始终渲染，不用担心 dom 变更的问题
- react component 不确定
  - 直接渲染且未来不变
  - 始终 return null, 忽略不管
  - return dom list，暂时不管，return first
  - return dom first, then return null，忽略不管，最终的 mirror 也同样会消失
  - return null first, then return dom
  - return dom first, but changed dom after
