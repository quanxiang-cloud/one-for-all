# Artery Renderer

Artery Renderer, aka 渲染引擎, 可以将 [Artery](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/artery) 渲染成真正的 Web 页面。

和其他渲染引擎相比，Artery Renderer 最大的特点就是**开放**和**可扩展**。Artery Renderer 不要求在某个公司的特定生态里才能使用；Artery Renderer 没有内置任何组件，但是可以接对几乎任何组件库；Artery Renderer 不限定任何的 API 风格，开发者可以根据自己的实际业务实现相应的 adapter；开发者不但可以使用 Artery Renderer 来完成整个前端的所有页面的渲染，也可以将其当作一个普通的组件，使用到页面的某个部分中。

[查看 Artery Renderer 的实现原理](docs/zh/how-artery-renderer-works.md)。

## 对 Artery 的全面支持

Artery Renderer 提供了对 Artery 的全面支持，包括但不限于:

- 支持路由
- 支持 sharedState 和 apiState
- 支持按需下载组件
- 支持原生的 HTML Node
- 支持各种类型的 property

## 灵活的扩展能力

Artery Renderer 提供了必要的扩展接口，开发者可以根据自己的实际情况按需实现。

### ComponentLoader & Repository

Artery Renderer 没有内置任何组件，渲染时用到的组件需要开发者通过实现 `ComponentLoader` or/and `Repository` 这两个接口来提供，这意味着开发者可以使用任意的自己喜欢的组件，可以很容易实现组件升级和替换，可以很方便的实现 A/B test 等。

### APISpecAdapter

Artery Renderer 没有限定 API 风格或者 request/response 格式，开发者可以通过实现 `APISpecAdapter` 来对接已有的 API，而不需要为了使用 Artery Renderer 而修改 API。如何对接的 API 为 RESTful 风格，那可以直接使用我们提供的 [adapter](https://www.npmjs.com/package/@one-for-all/api-spec-adapter)。

除了可以灵活的对接已有 API 以外，`APISpecAdapter` 的另一个重要作用就是大大简化了在 Artery 中声明调用 API 逻辑的成本。例如在 Artery 中，我们只需要写 `this.apiState.someData.fetch({ foo: 'bar' })` 就可以调用某个 API，而不用关心 API 的具体 request 格式。

### RefLoader

对于体积较大的 Artery，我们可以将其拆分成各个部分，然后使用 `ref-node` 类型在渲染阶段将其组合。Artery Renderer 的 `RefLoader` 接口用于下载这种引用类型的 Artery。

AKA render engine, render [Artery](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/artery) into read UI.

TL;DR;

- Artery Renderer is a implementation of MVC
- Artery Renderer uses React and RxJS to implement View and Model
- Artery Renderer is extremely extensible, you can implement plug-ins as needed

- Usage
- How Artery Renderer works
- FAQ

## Quick Start

Install by npm or yarn:

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
