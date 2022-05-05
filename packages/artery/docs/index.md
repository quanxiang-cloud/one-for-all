# Artery

低代码工具链中的有两个非常重要的环节，一是为开发者提供一套功能完备的用于构建动态页面的页面引擎，二是将前者构建的页面渲染给最终用户使用的渲染引擎。初看上去，页面引擎似乎包含了渲染引擎的能力，但是其实不然。

渲染引擎的重点在于正确且高效的执行开发者的意图，为用户提供符合预期的 UI，渲染引擎只要以一个 URL 为输入就能渲染出一个页面，这个页面又可以链接到其他地址，进而形成完整的业务逻辑链条；页面引擎的重点在组织页面结构和编排页面内元素的交互逻辑，为了能够让开发者操作页面元素，不能简单的也没有必要按照生产环境的标准渲染页面，而且页面引擎还需要提供调试、预览和历史记录等功能。

页面引擎和渲染引擎侧重点虽然不同，但是两者又是紧密联系在一起的。通过页面引擎构建的页面，最终需要交给渲染引擎来渲染，页面引擎最后导出的结果需要被渲染引擎认可，所以为了两者能更好的配合，需要使用统一的语言来沟通。Artery 为此而生。

## Artery 是什么？

Artery 是一种用来描述单页面应用 SPA 的[接口描述语言](https://en.wikipedia.org/wiki/Interface_description_language)，Artery 是一套与实现无关的标准。

我们可以使用 Artery 来描述完整的前端业务，包括 UI、状态和两者之间的关系。理论上，任何的 SPA 都可以使用 Artery 来表达，并由渲染引擎来渲染。全象低代码平台前端核心组件的使用 [Demo](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/example) 的全部功能都是由 Artery 来描述的。

Artery 是[渲染引擎](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/Artery-renderer)和[页面引擎](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/Artery-engine)对接的共同语言，以 Artery 作为标准，我们可以分别独立开发渲染引擎和页面引擎，使得两者之间没有耦合。

Artery 本身并没有约定页面引擎和渲染引擎的实现，任何人都可以按照自己的想法实现对 Artery 的编辑、组合和渲染功能。

## Artery 结构简介

Artery 的结构十分简单，但是任然有许多需要注意的细节，在这里简单给出 Artery 整体结构介绍，更新细节设计请参考对应的 reference。

Artery 由三部分组成:

- `Node` 描述页面结构和组成元素的的 Tree
- `APIStateSpec` 描述页面中使用的 API
- `SharedStatesSpec` 描述页面中的共享状态，或者说本地同步状态

### Node

Node 的数据结构是 Tree，由节点、节点属性和子节点组成。正如 DOM 的结构一样，Node 的结构也反映了最后渲染的页面结构。不同类型的节点 Node 由 `type` 字段区分，不同类型的节点的属性 Property 也有所差异。

#### BaseNode

`BaseNode` 上定义了节点的通用属性，所有节点都是扩展的 `BaseNode`。

| 名称             | Required | Type                       | 描述                                                                         |
| :--------------- | -------- | -------------------------- | ---------------------------------------------------------------------------- |
| `id`             | 是       | `string`                   | 节点在整个 Artery 中的唯一标识                                               |
| `type`           | 是       | `string` enum              | 表示节点的类型，例如 `html-element` `react-component` 等                     |
| `props`          | 否       | `Record<string, Property>` | 表示在渲染节点时传递的参数，这些参数不是具体的值，而是描述**如何取值的说明** |
| `shouldRender`   | 否       | `ShouldRenderCondition`    | 是否渲染此节点的规则                                                         |
| `lifecycleHooks` | 否       | `LifecycleHooks`           | 节点生命周期规则                                                             |

#### HTMLNode

HTMLNode 节点会使用原生的 HTML 来渲染，需要指定使用哪个 HTML tag 渲染。

| 名称       | require | Type           | 描述                                  |
| :--------- | ------- | -------------- | ------------------------------------- |
| `type`     | 是      | `string`       | 值为 `html-element`                   |
| `name`     | 是      | `string`       | HTML tag，如 `div` `span` `button` 等 |
| `children` | 否      | `ArteryNode[]` | 子节点                                |

#### ReactComponentNode

ReactComponentNode 节点需要使用 React Component 来渲染，需要声明组件所在的 package 等信息，用来定位到组件的具体实现。

| 名称                   | Required | Type           | 描述                             |
| :--------------------- | -------- | -------------- | -------------------------------- |
| `type`                 | 是       | `string`       | 值为 `react-component`           |
| `packageName`          | 是       | `string`       | 组件所属的 package 名称          |
| `packageVersion`       | 是       | `string`       | 组件所属的 package 版本          |
| `exportName`           | 否       | `string`       | 组件的导出名称，默认为 `default` |
| `supportStateExposure` | 否       | `boolean`      | 表示组件是否支持对外暴露内部状态 |
| `children`             | 否       | `ArteryNode[]` | 子节点                           |

#### ComposedNode

此节点是由多个其他类型的节点共同组成，这些节点可以共享同一个状态，一般用在循环渲染中。

| 名称       | Required | Type                               | 描述                                                                                |
| :--------- | -------- | ---------------------------------- | ----------------------------------------------------------------------------------- |
| `type`     | 是       | `string`                           | 值为 `composed-node`                                                                |
| `outLayer` | 否       | `HTMLNode` or `ReactComponentNode` | 表示被组合节点的外层元素，可以为空                                                  |
| `nodes`    | 是       | `ArteryNode[]`                     | 即被组合的节点列表，且每个节点都必须实现 `toProps` 方法，用来接受前面提到的共享状态 |

#### LoopContainerNode

此节点是一个循环渲染的容器，用于循环渲染某个节点。

| 名称            | Required | Type              | 描述                                                                                                 |
| :-------------- | -------- | ----------------- | ---------------------------------------------------------------------------------------------------- |
| `type`          | 是       | `string`          | 值为 `loop-container`                                                                                |
| `iterableState` | 是       | `PlainState`      | 表示循环的数据来源，其实际值需要为一个数组                                                           |
| `loopKey`       | 是       | `string`          | 当被循环的数组元素为对象，loopKey 为对象的唯一标识，如果被循环的数组元素为基础类型，loopKey 可以为空 |
| `node`          | 是       | `ArteryNode`      | 即被循环渲染的节点                                                                                   |
| `toProps`       | 是       | `ToPropsFuncSpec` | 循环数据转换函数                                                                                     |

注：`toProps` 当被循环的节点为 `html-element` 和 `composed-node` 时，可以在 `toProps` 中将数组元素转化为节点需要的格式，当 node 为 `composed-node` 时，toProps 需要省略，因为已经在被组合的节点中实现了

#### RefNode

此节点为外部引用节点，在节点上记录了外部 Artery 的 ID，可以通过此节点实现 Artery 的组合。

| 名称       | Required | Type         | 描述                                                                                               |
| :--------- | -------- | ------------ | -------------------------------------------------------------------------------------------------- |
| `type`     | 是       | `string`     | 值为 `ref-node`                                                                                    |
| `ArteryID` | 是       | `string`     | 被引用的 Artery ID                                                                                 |
| `fallback` | 否       | `Node` | 当对应的 Artery 还有没加载之前，在页面中渲染的内容，可选                                           |
| `orphan`   | 否       | `boolean`    | ref-node 默认继承父节点的状态，如果想让父节点和 ref-node 子节点状态隔离，可以将 orphan 设置为 true |

#### RouteNode

表示此节点为路由节点。

| 名称      | Required | Type         | 描述                 |
| :-------- | -------- | ------------ | -------------------- |
| `type`    | 是       | `string`     | 值为 `route-node`    |
| `path`    | 是       | `string`     |                      |
| `node`    | 是       | `Node` | 此路由渲染的节点     |
| `exactly` | 是       | `boolean`    | 是否严格匹配当前路径 |

## 节点 Property

组件一般需要传递多个指定的参数才能正常渲染，在 Artery 中通过 props 定义传递哪些参数和这些参数的值来自哪里。在写 property 时，需要写明 property 的具体类型，类型有下列：

- `constant_property`
- `api_result_property`
- `api_loading_property`
- `shared_state_property`
- `node_state_property`
- `functional_property`
- `render_property`

同样的，不同的 property 类型不同的特定参数。

### ConstantProperty

| 名称    | Required | 描述                |
| :------ | -------- | ------------------- |
| `type`  | 是       | `constant_property` |
| `value` | 是       | 此属性的值          |

### APIResultProperty

| 名称        | Required | 描述                                                 |
| :---------- | -------- | ---------------------------------------------------- |
| `type`      | 是       | `api_result_property`                                |
| `stateID`   | 是       | string                                               |
| `convertor` | 否       | `StateConvertExpression` or `StateConvertorFuncSpec` |
| `fallback`  | 是       | `Fallback`                                           |

### APILoadingProperty

| 名称      | Required | 描述                   |
| :-------- | -------- | ---------------------- |
| `type`    | 是       | `api_loading_property` |
| `stateID` | 是       | 状态唯一标识 ID        |

### SharedStateProperty

| 名称        | Required | 描述                                             |
| :---------- | -------- | ------------------------------------------------ |
| `type`      | 是       | `shared_state_property`                          |
| `stateID`   | 是       | string                                           |
| `fallback`  | 是       | Fallback                                         |
| `convertor` | 否       | StateConvertExpression or StateConvertorFuncSpec |

### NodeStateProperty

| 名称        | Required | 描述                                             |
| :---------- | -------- | ------------------------------------------------ |
| `type`      | 是       | `node_state_property`                            |
| `nodePath`  | 是       | string                                           |
| `fallback`  | 是       | Fallback                                         |
| `convertor` | 否       | StateConvertExpression or StateConvertorFuncSpec |

### FunctionalProperty

| 名称   | Required | 描述                  |
| :----- | -------- | --------------------- |
| `type` | 是       | `functional_property` |
| `func` | 是       | BaseFunctionSpec      |

### RenderProperty

| 名称      | Required | 描述                                                            |
| :-------- | -------- | --------------------------------------------------------------- |
| `type`    | 是       | `render_property`                                               |
| `node`    | 是       | ArteryNode                                                      |
| `adapter` | 是       | `BaseFunctionSpec & { type: 'render_property_function_spec'; }` |

### ComputedProperty

| 名称        | Required | 描述                                             |
| :---------- | -------- | ------------------------------------------------ |
| `type`      | 是       | `computed_property`                              |
| `deps`      | 是       | Array<ComputedDependency>                        |
| `convertor` | 是       | StateConvertExpression or StateConvertorFuncSpec |
| `fallback`  | 是       | unknown                                          |

### InheritedProperty

| 名称        | Required | 描述                                             |
| :---------- | -------- | ------------------------------------------------ |
| `type`      | 是       | `inherited_property`                             |
| `parentID`  | 是       | string                                           |
| `convertor` | 否       | StateConvertExpression or StateConvertorFuncSpec |
| `fallback`  | 是       | unknown                                          |

### APIStateSpec

APIStateSpec 里定义了当前页面中用到的哪个 API 和对应的状态名称。APIStateSpec 的数据类型定义如下：

```typescript
interface APIState {
  loading: boolean;
  result?: unknown;
  error?: Error;
}

// map of stateID and apiState
type APIStatesSpec = Record<string, { apiID: string; [key: string]: unknown }>;
```

注意到在 APIStatesSpec 中只记录了一个 `apiID`, 并没有关于 API request/response 等信息的描述，这是有意为之的，为了让实现方根据自己的实际情况来解析 API 的具体格式，方便扩展。

### SharedStatesSpec

SharedStates 的主要作用是为页面元素之前传递或者共享数据使用，其结构定义相对简单， TypeScript 格式类型定义如下：

```typescript
interface SharedState {
  initial: unknown;
}

type SharedStatesSpec = Record<string, SharedState>;
```
