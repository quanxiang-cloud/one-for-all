# Artery Renderer

Render [Artery](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/artery) to web page.

Artery Renderer, aka 渲染引擎, 可以将 Artery 渲染成真正的 Web 页面。Artery Renderer 是低代码前端领域的重要组成部分，但是它并不依附于低代码而存在，在一般的单页面应用和传统服务端渲染的场景也可以使用，提升开发和迭代效率。

## 对 Artery 的全面支持

Artery 是一种与实现无关的接口描述语言，Artery Renderer 提供了对 Artery 的全面支持。

- 支持路由
- 支持动态下载组件
- 支持原生的 HTML node
- 支持各种类型的 props

## 灵活的扩展能力

Artery Renderer 提供了必要的扩展接口，开发者可以根据自己的实际情况按需实现。

### ComponentLoader

Artery Renderer 虽然是基于 React 实现的，但是没有内置任何 React Component，不过借助 React 的 API，Artery Renderer 可以直接创建 HTML element，也就是说如果 Artery 中的全部节点都是 `html-element`，那使用 Artery Renderer 的方式将非常简单，例如 `<ArteryRender artery={artery} />`。

Artery Renderer 提供了按需下载组件的接口，类型声明如下：

```typescript
interface ComponentLoaderParam {
  packageName: string;
  packageVersion: string;
  exportName: string;
}

type ComponentLoader = (locator: ComponentLoaderParam) => Promise<Component>
```

ComponentLoader 返回的组件可以是函数式组件，也可以是 Class 组件。

### Repository

渲染页面的组件可以动态加载，也可以直接注入到 Artery Renderer 实例中。在渲染阶段，当节点需要外部组件时，会首先查找 `Repository`，如果没有对应的实现才会调用 `ComponentLoader`。 `Repository` 是一个组件实现的集合对象，一个 Artery 中可能用到的 package 不止一个，但是 package 名称应当是全局唯一的。Repository 就是 package 和 package 中的组件的集合，类型如下:

```typescript
type Repository = Record<PackageNameVersion, Record<string, Component>>;
```

其中 `PackageNameVersion` 是 package `名称`和`版本`使用 `@` 连在一起的字符串，例如 `myAwesomeComponents@1.0.0`, `Record<string, Component>` 中的 `string` 为 package 中的组件的 export name。

### APISpecAdapter

动态渲染页面离不开 API 数据。Artery Renderer 使用 RxJS 内置的 [ajax](https://rxjs.dev/api/ajax/ajax) 来作为 HTTP client。当调用 API 时，开发者有责任提供符合要求的[request config](https://github.com/quanxiang-cloud/one-for-all/blob/main/packages/api-spec-adapter/src/types.ts#L35) 对象，此对象中包含了一个 HTTP 请求所必须的 Method, URL 和 Params 等信息。

手动构造完整的 request config 对象会很繁琐且不可扩展，为了让 view、model 和 API 之前的层次更加清晰，Artery Renderer 提供了 `APISpecAdapter` 接口。`APISpecAdapter` 中有一个 `RequestBuilder` 方法，用来将统一的参数转化为标准的 request config 对象。你可以根据自己的实际业务需求实现完整的 `APISpecAdapter`，也可以扩展我们提供的一个[适配 swagger spec 的实现](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/api-spec-adapter)。

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

### RefLoader

对于体积较大的 Artery，我们可以将其拆分成各个部分，然后使用 `ref-node` 类型在渲染阶段将其组合。Artery Renderer 的 `RefLoader` 接口用于下载这种引用类型的 Artery。

```typescript
type RefLoader = (arteryID: string) => Promise<{ Artery: ArterySpec.Artery; plugins?: Plugins }>;
```

## Get Start

Install render engine use npm or yarn:

```bash
npm install @one-for-all/artery-renderer
```

```jsx
import React from 'react';
import { RefLoader, Repository, ArteryRenderer } from '@one-for-all/artery-renderer';

const plugins: Plugins = {
  apiSpecAdapter?: APISpecAdapter,
  repository?: Repository,
  refLoader?: RefLoader,
  componentLoader?: ComponentLoader,
};

function Demo() {
  const Artery = getArteryBySomeway();

  return (<ArteryRenderer Artery={Artery} plugins={plugins} />);
}

```

## Example

please checkout our [example repo](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/example) for more.
