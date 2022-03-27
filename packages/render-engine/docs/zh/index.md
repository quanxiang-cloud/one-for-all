# Overview

渲染引擎可以解析 Schema 并将其渲染成 UI。

在使用渲染引擎之前，建议先了解一下 [Schema](https://github.com/quanxiang-cloud/one-for-all/tree/master/packages/schema-spec) 的格式。

## For impatient readers

渲染引擎是什么？渲染引擎能解决什么问题？渲染引擎是如何实现的？
等等这些问题需要很长的篇幅来回答，我后面会逐步补充，如果你没有耐心阅读完全部的内容，
那只读这一片文章，暂时接受文中的观点，就够了。

我们可以使用 Schema 来描述 SAP，渲染引擎可以将 Schema 渲染成真正的 SAP。
HTML，这种古老但是永不过时的语言，展示了页面是由什么构成的。JavaScript，既古老又年轻的语言，让页面可以与用户互动。
让用户可以点击，键盘输入等，让静止的页面活了起来。

为了达到这个目的，天才的开发了很多的 framework，就是大家所熟知的 BackboneJS、EmberJS、ReactJS、VueJS，AngularJS 等。
有了这些 framework 的支持，我们可以更加高效的开发出页面，人们对这种模式也比较满意。

问题就是虽然开发效率提高了，但是程序员却越来越不够用了。机器的发明，虽然会让一部分工人失业，但是同时又创造了更多的就业机会。
面对各种定制化需求，再多的程序员也无法满足，所以我们可以把任何人都变成程序员吗？
定制化需求不但来自可以，也可能来自我们自己，比如我们需要根据不同的用户渲染不用的 UI，是不断的写 if-else？还是维护不同的模版？还是按需为用户生成 UI？

渲染引擎就是为了解决上面的问题。如何解决？

上述问题都有一个共同的特点，就是需求是不确定且要经常变更的，面对这种情况，改代码再发布上线的流程极大的限制了效率。
但是我们可不可以不用改代码，也能让 UI 更新。其实这种方式我们一致在做，但是做的不够彻底。比如我们维护一套配置文件，
如果配置文件改了，相应的 UI 也改了，这种方式的问题是不可扩展，非常的不可扩展，从迭代到开发新功能到新项目到同一个公司下的不同项目，从各个方面来说都是不可扩展的。
为什么我们这么执着于扩展性，良好的扩展性以为着灵活，能最大限度的满足各方的需求。

什么才是彻底的做法？将整个页面都改为通过配置的方式生成。换句话说，以 Schema 为标准，以符合标准的 JSON 为输入，使用渲染引擎来渲染出实际的页面。

说了这么多，我们的目的清楚了吧？我们要解决的是什么问题？现在我们来聊聊具体的实现吧。

罗马不是一天建成的，渲染引擎也不是从零开发的，我还是站在了前辈们的肩膀上开发了渲染引擎，虽然叫引擎，但是像虚幻引擎那般强大。我们目前所做的是基于 React 和 RxJS 来渲染一个 JSON，
渲染引擎离不开 React 和 Rxjs，你可能会问渲染引擎的组件在哪里？嗯，渲染引擎没有内置任何组件。这么说可能有点乱，容我下说一下自己当年开发渲染引擎的思路经过吧。

在渲染引擎出来之前，其实这个世界上已经有了类似的东西，例如百度的 amis 等。但是他们一致有一个问题就是组件和引擎没有解耦，不解耦的点主要体现在：

- 组件需要符合渲染引擎的标准
- 组件不能单独加载
- 组件扩展困难，用户需求的组件功能是无穷的，如果采用 amis 的方式，那程序员只是由开发完整的页面，变成了开发专用的组件，这些组件其实没有任何复用性

所以，组件和渲染引擎一定要是独立的。他们难道没有意识到这个问题吗？当然意识到了。但是他们为什么不让引擎和组件独立呢？因为我们需要解决另一个问题：Model

在组件和引擎耦合的情况下，实现 Model 容易了很多，因为组建的接口是确定的，我们可以为组件定制生成其渲染需要的数据结构。

那我们如何在不耦合组件的情况下，通过声明式来实现 Model 呢？啊，这个问题困扰了我好几个月，做梦都想着如何实现。但，最后还是被我实现了。



## Install

你可以使用 yarn 或者 npm 安装渲染引擎。

```bash
npm install @one-for-all/render-engine

# or

yarn add @one-for-all/render-engine
```

## Motivation

渲染引擎是低代码前端领域的重要组成部分，但是它并不依附于低代码而存在，在一般的单页面应用和传统服
务端渲染的场景也可以使用渲染引擎，提升开发和迭代效率。

总体来说使用 Schema 和渲染引擎来构建前端业务有一下几点优势：

- 上手难度低，学习 Schema 的成本要远远低于学习 React 或者 Vue 等前端 framework
- 修改成本低，Schema 其实是属于数据的一部分，修改 Schema 后并不需要重新构建
- 复制成本低，在 CURD 的场景中，借助 Schema 加渲染引擎的模式，可以快速的构建相似逻辑的前端业务
- 定制开发容易，可是使用 Schema 自己自由组合前端的业务逻辑，充分满足客户的定制化需求
- 实现真正的动态开发，可以根据业务需要，按需开发

## Plugins

渲染引擎处在将 Schema 变成页面的整个环节的底层，为了实现更多的功能，渲染引擎提供了众多的插件接
口，开发者可以根据 Schema 的具体内容，按需选择实现对应的接口。

### ComponentLoader

渲染引擎虽然是基于 React 实现的，但是没有内置任何 React Component，不过借助 React 的 API，
渲染引擎可以直接创建 HTML element，也就是说如果 Schema 中的全部节点都是 `html-element`，
那使用渲染引擎的方式将非常简单，例如 `<SchemaRender schema={schema} />`。

渲染引擎提供了按需下载组件的接口，类型声明如下：

```typescript
interface ComponentLoaderParam {
  packageName: string;
  packageVersion: string;
  exportName: string;
}

type ComponentLoader = (locator: ComponentLoaderParam) => Promise<DynamicComponent>
```

### Repository

```typescript
type Repository = Record<PackageNameVersion, Record<string, Component>>;
```

渲染页面的组件可以动态加载，也可以直接注入到渲染引擎实例中。在渲染阶段，当节点需要外部组件时，
会首先查找 `Repository`，如果没有对应的实现才会调用 `ComponentLoaderParam`。 `Repository`
 是一个组件实现的集合对象，类型如下:

### APISpecAdapter

```typescript
type RequestBuilder = (apiID: string, fetchParams?: FetchParams) => AjaxConfig | undefined;

type RawResponse = Partial<{
  body: unknown;
  error: Error;
}>;

type ResponseAdapter = (res: RawResponse) => Res;

interface APISpecAdapter {
  build: RequestBuilder;
  responseAdapter?: ResponseAdapter;
}
```

动态渲染页面离不开 API 数据。渲染引擎使用 RxJS 内置的 [ajax](https://rxjs.dev/api/ajax/ajax)
 来作为 HTTP client。当调用 API 时，开发者有责任提供符合要求的[request config](https://github.com/quanxiang-cloud/one-for-all/blob/main/packages/api-spec-adapter/src/types.ts#L35)
对象，此对象中包含了一个 HTTP 请求所必须的 Method, URL 和 Params 等信息。

手动构造完整的 request config 对象会很繁琐且不可扩展，为了让 view、model 和 API 之前的层次
更加清晰，渲染引擎提供了 `APISpecAdapter` 接口。`APISpecAdapter` 中有一个 `RequestBuilder`
 方法，用来将统一的参数转化为标准的 request config 对象。你可以根据自己的实际业务需求实现完整
的 `APISpecAdapter`，也可以扩展我们提供的一个[适配 swagger spec 的实现](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/api-spec-adapter)。

### RefLoader

```typescript
type RefLoader = (schemaID: string) => Promise<{ schema: SchemaSpec.Schema; plugins?: Plugins }>;
```

对于体积较大的 Schema，我们可以将其拆分成各个部分，然后使用 `ref-node` 类型在渲染阶段将其组
合。渲染引擎的 `RefLoader` 接口用于下载这种引用类型的 Schema。

## Usage

渲染引擎可以被当作一个普通的 React 组件使用，也可以创建一个渲染引擎实例，然后将 UI 渲染到某个
 DOM 节点上。

```javascript
import { RenderEngine, SchemaRender } from '@one-for-all/render-engine';

// react component
function Demo() {
  const schema = getSchemaBySomeway();

  return (<SchemaRender schema={schema} />);
}

// render engine instance
const container = document.getElementById('some-container');
const renderEngine = new RenderEngine(schema);
renderEngine.render(container);

```

## Example

请参考 https://github.com/quanxiang-cloud/one-for-all/tree/master/packages/example
