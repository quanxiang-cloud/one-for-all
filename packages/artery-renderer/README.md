# Artery Renderer

Artery Renderer, aka 渲染引擎, 将 [Artery](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/artery) 渲染成真正的 Web 页面。

[查看 Artery Renderer 的实现原理](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/artery-renderer/docs/01-how-artery-renderer-works.md)

[Online Todo Demo](https://ofapkg-demo.gd2.qingstor.com/index.html)

## 什么场景下适合用 Artery Renderer？

只有在适合的场景中，Artery Renderer 才能体现它的价值，这些场景可以大致归位三类：

- **业务需求经常变更的场景**：例如促销活动页面，问卷调查页面等。
- **大量相似业务的场景**：例如相似模式的数据的列表页面，详情页和创建修改页面等。
- **需要为用户提供灵活定制化能力的场景**: 例如 Dashboard 页面，个人主页等。
- **数据或配置驱动的场景**：例如需要根据不同的环境不同的数据，甚至是不同用户而渲染不同页面的场景。

以上场景都有的共同特点是**多变**和**不确定性**，如果用传统的方式实现上述场景的业务，需要耗费大量的人力做重复的事情。

如果用 Artery + Artery Renderer 或者说低代码的方式来实现，不但节省了人力，而且还能加快迭代速度。概括的说，我们从以下几个维度来解决问题：

### 更高层次的语言抽象

我们提供了一种接口描述语言 [Artery](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/artery)。开发者编写 Artery 不需要开发者懂 React 或者 Vue 等前端框架，只要有基本的 JavaScript 知识即可，降低了编码复杂度。同时，开发者也从复杂冗长的开发、部署、测试流程中解放出来，将更多的精力放到业务上。当然，开发者可以直接编写 Artery，也可以提前编写一些模版或者工具类函数来生成 Artery。

### 极低的复制成本

Artery 是一份有明确结构的 JSON 数据，只要复制一份 Artery 将相当于复制了对应的页面。如果业务逻辑相似，那只需要对 Artery 做简单修改就能适配相应的 API，这个过程不需要再次构建前端或者重启服务。

例如常见的数据增删改差页面，一般都有列表页面、各种操作按钮、详情页面和新建页面。不同业务数据的差异仅仅是字段的不同而已，页面结构和交互完全类似。面对这种业务就能用低代码的方式，极低成本的实现复制。

### 动态组合能力

同样因为有 Artery 这种和实现无关的语言支持，我们可以按照配置数据或者某些用户数据，动态生成/预生成 Artery，实现由配置推导出前端页面。这听上去像是我们熟知的模版能力，区别是模版只能生成静态页面，而 Artery + Artery Renderer 可以实现完成的单页面应用。

## 为什么选择 Artery Renderer？

目前开源的渲染引擎实现有很多，Artery Renderer 和同类项目相比有以下优点：

- Artery Renderer 是一个通用的渲染引擎，既可以实现 Dashboard，也可以实现增删改查业务，更可以用来构建完整的 ERP 前端
- Artery Renderer 提供了对 Artery 的全面支持，包括路由和各种类型的 Property 等
- Artery Renderer 不要求在某个公司的特定生态里才能使用
- Artery Renderer 没有内置任何组件，但是可以接对几乎任何组件库
- Artery Renderer 不限定任何的 API 风格，开发者可以根据自己的实际业务实现相应的 adapter
- Artery Renderer 可以完成整个前端的所有页面渲染，也可以将其当作一个普通的组件，使用到页面的某个部分中

## 开放能力

Artery Renderer 之所以能够如此通用和灵活，是因为其将在不同场景下有很大差异的部分，都提供了自定义实现的接口。

### ComponentLoader & Repository

Artery Renderer 没有内置任何组件，渲染时用到的组件需要开发者通过实现 `ComponentLoader` or/and `Repository` 这两个接口来提供，这意味着开发者可以使用任意的自己喜欢的组件，可以很容易实现组件升级和替换，可以很方便的实现 A/B test 等。

不过，Artery Render 是基于 React 实现的，所以天然支持渲染 HTML 节点，所以你要实现的页面不需要 React 组件，那这两个接口可以不实现。

### APISpecAdapter

Artery Renderer 没有限定 API 风格或者 request/response 格式，开发者可以通过实现 `APISpecAdapter` 来对接已有的 API，而不需要为了使用 Artery Renderer 而修改 API。

如果对接的 API 为 RESTful 风格，那可以直接使用我们提供的 [adapter](https://www.npmjs.com/package/@one-for-all/api-spec-adapter)。

除了可以灵活的对接已有 API 以外，`APISpecAdapter` 的另一个重要作用就是大大简化了在 Artery 中声明调用 API 逻辑的成本。例如在 Artery 中，我们只需要写 `this.apiState.someData.fetch({ foo: 'bar' })` 就可以调用某个 API，而不用关心 API 的具体 request 格式。

### RefLoader

对于体积较大的 Artery，我们可以将其拆分成各个部分，然后使用 `ref-node` 类型在渲染阶段将其组合。Artery Renderer 的 `RefLoader` 接口用于下载这种引用类型的 Artery。

## 安装和使用

Install by npm or yarn:

```bash
npm install @one-for-all/artery-renderer
```

```jsx
import React from 'react';
import { ArteryRenderer } from '@one-for-all/artery-renderer';
import type { RefLoader, Repository } from '@one-for-all/artery-renderer';

// const myCustomAPIAdapter: APISpecAdapter = {};
// const myCustomRepository: Repository = {};
// const myCustomRefLoader: refLoader = (arteryID: string): Promise<{ artery: ArterySpec.Artery; plugins?: Plugins }> => { return fetchSomething(); }
// const myCustomComponentLoader: ComponentLoader = (locator: ComponentLoaderParam) => { return someComponent; };

const plugins: Plugins = {
  // apiSpecAdapter: myCustomAPIAdapter,
  // repository: myCustomRepository,
  // refLoader: myCustomRefLoader,
  // componentLoader: myCustomComponentLoader,
};

function Demo() {
  const Artery = getArteryBySomeway();

  return (<ArteryRenderer Artery={Artery} plugins={plugins} />);
}

```

## Example

please checkout our [example repo](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/example) for more.
