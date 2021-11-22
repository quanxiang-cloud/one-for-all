import type { BehaviorSubject } from 'rxjs';
import type { FetchParams } from '@ofa/api-spec-adapter';

export type Serialized = 'Serialized';
export type Instantiated = 'Instantiated';

export type APIState = {
  loading: boolean;
  result?: any;
  error?: Error;
};

export const enum NodePropType {
  ConstantProperty = 'constant_property',
  APIResultProperty = 'api_result_property',
  APILoadingProperty = 'api_loading_property',
  // todo api error property
  SharedStateProperty = 'shared_state_property',
  NodeStateProperty = 'node_state_property',

  APIInvokeProperty = 'api_invoke_property',
  SharedStateMutationProperty = 'shared_state_mutation_property',

  FunctionalProperty = 'functional_property',
}

export type NodeProperty<T> =
  ConstantProperty |
  APIResultProperty<T> |
  APILoadingProperty |
  SharedStateProperty<T> |
  NodeStateProperty<T> |
  FunctionalProperty<T> |
  SharedStateMutationProperty<T> |
  APIInvokeProperty<T>;
  // Array<APIInvokeProperty<T>>;

export type NodeProperties<T> = Record<string, NodeProperty<T>>;

type BaseNodeProperty = {
  type: NodePropType;
}

export type ConstantProperty = BaseNodeProperty & {
  type: NodePropType.ConstantProperty;
  value: any;
}

export type APIResultProperty<T> = BaseNodeProperty & {
  type: NodePropType.APIResultProperty;
  // in the previous implementation, this property is called: initialValue,
  // why changed to `fallback`?
  // - please refer to API State Table, it's hard to modify the `data` to initialValue in the second stage
  // - always defining a fallback value for API response is best practices,
  //   no matter before API result returned or encounter a API error.
  // fallback is the latest NOT nullish value passed to node, it's NOT THE FALLBACK OF API RESPONSE
  // fallback will be passed to node when:
  // - api error
  // - adapter throw
  // - adapter return null/undefined
  // fallback value assignment happens only when:
  // - define schema
  // - adapter return NOT nullish value
  fallback: any;
  stateID: string;
  // todo define different type adapter
  // adapter will never be called if api error or api response body is undefined
  // todo add test cases
  convertor?: StateConvertor<T>;
}

export type StateConvertor<T> = T extends Serialized ? SerializedStateConvertor : StateConvertorFunc;
export type SerializedStateConvertor = StateConvertExpression | StateConvertorFuncSpec;
export type StateConvertorFunc = (v: any) => any;

type StateConvertExpression = {
  type: 'state_convert_expression';
  // expression for data, loading, params, error
  // state.foo
  // state.offset / (state.limit + state.offset)
  // state.list.map((item) => item.name))
  // state.list.map((item) => `名称：${item.name}`))
  // state.foo?.bar?.baz || 'someValue'
  expression: string;
}

export type StateConvertorFuncSpec = BaseFunctionSpec & {
  type: 'state_convertor_func_spec';
  args: 'state';
};

export type APILoadingProperty = BaseNodeProperty & {
  type: NodePropType.APILoadingProperty;
  stateID: string;
}

export type SharedStateProperty<T> = BaseNodeProperty & {
  type: NodePropType.SharedStateProperty;
  stateID: string;
  fallback: any;
  convertor?: StateConvertor<T>;
}

export type NodeStateProperty<T> = BaseNodeProperty & {
  type: NodePropType.NodeStateProperty;
  nodeKey: string;
  fallback: any;
  convertor?: StateConvertor<T>;
}

export type FunctionalProperty<T> = BaseNodeProperty & {
  type: NodePropType.FunctionalProperty;
  func: T extends Serialized ? BaseFunctionSpec : VersatileFunc;
}

// todo refactor this type property spec
export type SharedStateMutationProperty<T> = {
  type: NodePropType.SharedStateMutationProperty;
  stateID: string;
  convertor?: T extends Serialized ? BaseFunctionSpec : VersatileFunc;
}

// todo refactor this type property spec
export type APIInvokeProperty<T> = {
  type: NodePropType.APIInvokeProperty;
  stateID: string;
  // the required return type is too complex
  paramsBuilder?: ParamsBuilder<T>;
  callback?: T extends Serialized ? APIFetchCallbackSpec : APIFetchCallback;
}

export type ParamsBuilder<T> = T extends Serialized ?
  ParamsBuilderFuncSpec : (...args: any[]) => FetchParams;

export type ParamsBuilderFuncSpec = BaseFunctionSpec & {
  type: 'param_builder_func_spec';
}

export type BaseFunctionSpec = {
  type: string;
  args: string;
  body: string;
}

// 为什么这里采用 callback 的形式，而不是让 runAction 返回一个 promise 呢？
// - 在使用渲染引擎来实现页面逻辑的场景中，所有的 view 都是平等的，任何一个 view 都可以调用 API
// - 在 Pro Code 的场景中，view 有着明确的业务属性，就是说何时会调用 API 有着明确的逻辑
// - 一般的 API 请求都是副作用的，平等的 API 请求权限意味着不可控的副作用
// - 在 Pro Code 的场景中，为了避免不期望的副作用，需要引入状态标识和 request cancellation
// - 在 Pro Code 的场景中，实现状态标识和 request cancellation 需要很多的脑细胞
// - 为了简化，渲染引擎支持 API 请求自动 cancellation，当有新的 runAction 调用时，处在 pending 状态的 HTTP 请求会被 abort
// - 这样实现的问题就是，runAction 的副作用不保证会被执行
// - 所以如果 runAction return Promise 的话，那这个 Promise 可能永远处于 pending 的状态，例如下面的代码
//
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       // resolve will never be called
//       resolve();
//     }, forever);
//   });
//
// - 为了解决这个问题，需要把副作用都放到一个堆栈里?
// - 这样不好吧，比如用户多次点击一个按钮，成功后会有一个消息提示，那应该只提示一次吧
// - 再考虑一下
export type RunParam = {
  params?: FetchParams;
  callback?: APIFetchCallback;
}

export interface StatesHubAPI {
  getState$: (stateID: string) => BehaviorSubject<APIState>;
  runAction: (stateID: string, runParam: RunParam) => void;
  refresh: (stateID: string) => void;
}

export type APIFetchCallbackSpec = BaseFunctionSpec & {
  type: 'api_fetch_callback';
  args: '{ result, error }',
}

export type APIFetchCallback = (state: Omit<APIState, 'loading'>) => void;
export type APIFetch = (params: FetchParams, callback?: APIFetchCallback) => void;

export interface StatesHubShared {
  getState$: (stateID: string) => BehaviorSubject<any>;
  getState: (stateID: string) => any;
  getNodeState$: (nodeKey: string) => BehaviorSubject<any>;
  exposeNodeState: (nodeKey: string, state: any) => void;
  retrieveNodeState: (nodeKey: string) => any;
  initContext: (ctx: CTX) => void;
  mutateState: (stateID: string, state: any) => void;
}

export type APIStateWithFetch = APIState & {
  fetch: APIFetch;
  refresh: () => void;
}

export type CTX = {
  statesHubAPI: StatesHubAPI;
  statesHubShared: StatesHubShared;
  apiStates: Readonly<Record<string, APIStateWithFetch>>;
  states: Readonly<Record<string, any>>;
}

export type VersatileFunc = (...args: any) => any;

interface BaseNode<T> {
  key: string;
  type: 'html-element' | 'react-component';
  props: NodeProperties<T>;
  supportStateExposure?: boolean;
  children?: BaseNode<T>[];
}

interface HTMLNode<T> extends BaseNode<T> {
  type: 'html-element';
  name: string;
  children?: Array<SchemaNode<T>>;
}

interface ReactComponentNode<T> extends BaseNode<T> {
  type: 'react-component';
  packageName: string;
  packageVersion: string;
  exportName: 'default' | string;
  // not recommend, should avoid
  // subModule?: string;
  children?: Array<SchemaNode<T>>;
}

export type SchemaNode<T> = HTMLNode<T> | ReactComponentNode<T>;

// map of stateID and apiID
// todo should also store builder info
export type APIStatesSpec = Record<string, { apiID: string; [key: string]: any; }>;

export type SharedStatesSpec = Record<string, { initial: any; }>;

export type Schema = {
  node: SchemaNode<Serialized>;
  apiStateSpec: APIStatesSpec;
  sharedStatesSpec: SharedStatesSpec;
}

export type InstantiatedNode = SchemaNode<Instantiated>;

interface Document {
  adoptedStyleSheets: any[];
}

export type DynamicComponent = React.FC<any> | React.ComponentClass<any>;
