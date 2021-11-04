component props:

- function:
  - call API
  - mutate local state
  - call parent props?
  - component
- value:
  - constant value
  - api derived value
  - local state derived value
    - local store
    - other components state
    - parent component state

local state 是用的场景

- 组件缓存状态
- 组件之间通信， 两个组件之间，多组件之间通信
  - tab content 的显示和隐藏
  - modal 框的状态
  - toolbar 的状态
- key 的设计需要考虑下
- local & api state 都太松耦合了，肯定有组件不小心 mess up state 的情况，但是如果把 异形 数据的错误处理都交给组件，那是在是太不友好了
- 所以，组件可以提供一个期望的数据类型，然后 render engine 来判断数据格式时候满足
- 满足的时候自然直接返回数据就好了，不满足的情况应该是返回 零 值
- 关于数据结构的定义可以直接复用 open API 的规范
