# Overview

Schema 是一个 tree 结构的 JSON 数据，Schema 是页面结构和行为的描述文件，Schema 是一套与
实现无关的标准。

我们可以使用 Schema 来完整的表示前端业务，例如定义一个 table，此 table 的数据来自某
个 API 的 response，再比如定义一个简单的 [Todo App](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/example/src/todo-app)。

Schema 是渲染引擎和页面引擎对接的共同语言。以 Schema 作为标准，我们可以分别独立开发渲染引擎
和页面引擎，两者之间没有耦合。

## 为什么要用 Schema 来描述页面逻辑

总体来说使用 Schema 和渲染引擎来构建前端业务有一下几点优势：

- 上手难度低，学习 Schema 的成本要远远低于学习 React 或者 Vue 等前端 framework
- 修改成本低，Schema 其实是属于数据的一部分，修改 Schema 后并不需要重新构建
- 复制成本低，在 CURD 的场景中，借助 Schema 加渲染引擎的模式，可以快速的构建相似逻辑的前端业务
- 定制开发容易，可是使用 Schema 自己自由组合前端的业务逻辑，充分满足客户的定制化需求
- 实现真正的动态开发，可以根据业务需要，按需开发

# Node type 和 Property type

在浏览器中实现 UI 离不开 HTML、JavaScript 和 CSS 三者的组合。在现代前端开发中，我们将可复
用业务逻辑封装成组件，也就是把 HTML、JavaScript 和 CSS 三者封装在一起后对外暴露特定的接口，
然后通过组件的组合就构建出了完整的前端 UI。

Schema 是一个 tree 结构的 JSON 数据，正如 DOM 结构一样，节点有不同的类型，每个节点可以指定
渲染所必须的 Properties。

在 Schema 中，一个节点 Node 有下列比较重要的属性：

- id, 节点的唯一标识
- type, 表示节点的类型，例如 `html-element` `react-component` 等
- props, 表示在渲染节点时传递的参数，这些参数不是具体的值，而是描述**如何取值的说明**
- children, 表示子节点，类型是 Node 数组

不同 type 的节点 Node 需要不同的额外参数，具体如下：

当 type 为 `html-element` 时，需要指定如下参数：

- name: 即 HTML 的标签名称，如 `div` `span` `button` 等

当 type 为 `react-component` 时，表示此节点是由一个 React 组件渲染而来的，需要指定如下参数：

- packageName: 组件所属的 package 名称
- packageVersion: 组件所属的 package 版本
- exportName: 表示使用 package 的哪个 export member，缺省为 `default`
- supportStateExposure: 表示组件是否支持对外暴露内部状态

当 type 为 `composed-node` 时，表示次节点是由多个节点组合而成，这些节点可以共享同一个状态，一般用在循环渲染中，特定参数如下:

- outLayer, 表示被组合节点的外层元素，可以为空，类型可为 `html-element` 或者 `react-component`
- children, 即被组合的节点列表，且每个节点都必须实现 `toProps` 方法，用来接受前面提到的共享状态

当 type 为 `loop-container` 时，表示此节点为一个循环容器，可以用于循环渲染某个节点，特定参数如下：

- iterableState, 表示循环的数据来源，其实际值需要为一个数组
- loopKey, 当被循环的数组元素为对象，loopKey 为对象的唯一标识，如果被循环的数组元素为基础类型，loopKey 可以为空
- node, 即被循环渲染的节点
- toProps, 当被循环的节点为 `html-element` 和 `composed-node` 时，可以在 `toProps` 中将数组元素转化为节点需要的格式，当 node 为 `composed-node` 时，toProps 需要省略，因为已经在被组合的节点中实现了

当 type 为 `ref-node` 时，表示节点的具体内容需要再此根据某些 id 获取，可以用来实现 schema 的组合和分片，特定参数如下：

- schemaID
- fallback, 当对应的 schema 还有没加载之前，在页面中渲染的内容，可选
- orphan，ref-node 默认继承父节点的状态，如果想让父节点和 ref-node 子节点状态隔离，可以将 orphan 设置为 true

节点 Property 介绍。

组件一般需要传递多个指定的参数才能正常渲染，在 schema 中通过 props 定义传递哪些参数和这些参数的值来自哪里。在写 property 时，需要写明 property 的具体类型，类型有下列：

- `constant_property`
- `api_result_property`
- `api_loading_property`
- `shared_state_property`
- `node_state_property`
- `functional_property`
- `render_property`

同样的，不同的 property 类型不同的特定参数。
