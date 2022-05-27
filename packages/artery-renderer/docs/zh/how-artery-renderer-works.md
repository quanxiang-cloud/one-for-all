# Artery Renderer 是如何实现的

TL;DR;

- Artery Render 基于 RxJS 实现了 MVC 中的 Model, 基于 React Hooks 实现了 Controller
- Artery Render 将获取组件和构造 API 请求等，在不同场景中实现会有很大差异的地方，提供了自定义实现的接口
