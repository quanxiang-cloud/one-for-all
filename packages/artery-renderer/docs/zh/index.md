# Overview

渲染引擎可以解析 Schema 并将其渲染成 UI。

在使用渲染引擎之前，建议先了解一下 [Schema](https://github.com/quanxiang-cloud/one-for-all/tree/master/packages/schema-spec) 的格式。

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
type RefLoader = (arteryID: string) => Promise<{ schema: ArterySpec.Artery; plugins?: Plugins }>;
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
