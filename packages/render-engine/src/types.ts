import React from 'react';
import type { BehaviorSubject } from 'rxjs';
import type { FetchParams, APISpecAdapter } from '@ofa/api-spec-adapter';

export type Serialized = 'Serialized';
export type Instantiated = 'Instantiated';

// APIState define the type of API results from view perspective.
// This type is inspired by [react-query](https://react-query.tanstack.com/).
export type APIState = {
  loading: boolean;
  result?: unknown;
  error?: Error;
};

export const enum NodePropType {
  ConstantProperty = 'constant_property',
  APIResultProperty = 'api_result_property',
  APILoadingProperty = 'api_loading_property',
  // todo api error property
  SharedStateProperty = 'shared_state_property',
  NodeStateProperty = 'node_state_property',

  /**
   * @deprecated This type has been deprecated, please use FunctionalProperty instead
   */
  APIInvokeProperty = 'api_invoke_property',
  SharedStateMutationProperty = 'shared_state_mutation_property',
  FunctionalProperty = 'functional_property',
  RenderProperty = 'render_property',
}

export type NodeProperty<T extends Serialized | Instantiated> =
  ConstantProperty |
  APIResultProperty<T> |
  APILoadingProperty |
  SharedStateProperty<T> |
  NodeStateProperty<T> |
  FunctionalProperty<T> |
  SharedStateMutationProperty<T> |
  APIInvokeProperty<T> |
  RenderProperty<T>;
  // Array<APIInvokeProperty<T>>;

export type NodeProperties<T extends Serialized | Instantiated> = Record<string, NodeProperty<T>>;

type BaseNodeProperty = {
  type: NodePropType;
}

export type ConstantProperty = BaseNodeProperty & {
  type: NodePropType.ConstantProperty;
  value: unknown;
}

export type APIResultProperty<T> = BaseNodeProperty & {
  type: NodePropType.APIResultProperty;
  stateID: string;
  // Convertor is used to transform the API result before passing it to node,
  // convertor will never be called if API request failed or the result is nullish.
  // the signature of this function is: (state: unknown) => unknown,
  // there is only one argument called `state`, which is the `result` in APIState
  convertor?: StateConvertor<T>;
  // It is a best practice to always define a fallback for API results,
  // no matter before the API response returned or after an unexpected error has occurred.
  //
  // fallback should be a NOT nullish value, and will be passed to node in the following situations:
  // - the initial state
  // - API request failed or some business error returned
  // - convertor throw an error when calling it with API result
  // - convertor return `null` or `undefined`
  //
  // The value of fallback will not always be the same.
  // It will be assign a new value when convertor returned a not-nullish value.
  // If there is no convertor defined, fallback will be assigned to the latest not-nullish api result.
  //
  // Be Attention. fallback is NOT the fallback of API result, it is the fallback of a property passed to node.
  fallback: unknown;
}

export type StateConvertor<T> = T extends Serialized ? SerializedStateConvertor : StateConvertorFunc;
export type SerializedStateConvertor = StateConvertExpression | StateConvertorFuncSpec;
export type StateConvertorFunc = (v: any) => any;

export type StateConvertExpression = {
  type: 'state_convert_expression';
  // same as JavaScript expression, with a predefined variable called `state`
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

// toProps function should return Record<string, unknown>;
export type ToPropsFuncSpec = BaseFunctionSpec & {
  type: 'to_props_function_spec',
  args: 'state'
};
export type ToProps<T> = T extends Serialized ?
  ToPropsFuncSpec :
  (state: unknown) => Record<string, unknown>;

export type APILoadingProperty = BaseNodeProperty & {
  type: NodePropType.APILoadingProperty;
  stateID: string;
}

export type SharedStateProperty<T> = BaseNodeProperty & {
  type: NodePropType.SharedStateProperty;
  stateID: string;
  fallback: unknown;
  convertor?: StateConvertor<T>;
}

export type NodeStateProperty<T> = BaseNodeProperty & {
  type: NodePropType.NodeStateProperty;
  nodeKey: string;
  fallback: unknown;
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

/**
 * @deprecated This type has been deprecated, please use FunctionalProperty instead
 */
export type APIInvokeProperty<T> = {
  type: NodePropType.APIInvokeProperty;
  stateID: string;
  // the required return type is too complex
  paramsBuilder?: ParamsBuilder<T>;
  callback?: T extends Serialized ? APIFetchCallbackSpec : APIFetchCallback;
}

// It is common to passing a component to another component,
// or defined a function which may take some argument and return a component.
// RenderProperty is the spec for this kind of property.
//
// <ParentComponent
//   render={<SomeComponent />}
// />
// <ParentComponent
//   render={(someData): JSX.Element => (<SomeComponent data={someData} />)}
// />
// <ParentComponent
//   render={(someData, someIgnoredValue): JSX.Element => (<SomeComponent data={someData} otherProp={otherProp} />)}
// />
export type RenderProperty<T extends Serialized | Instantiated> = BaseNodeProperty & {
  type: NodePropType.RenderProperty;
  adapter: RenderPropertyAdapter<T>;
  node: SchemaNode<T>;
}

export type RenderPropertyAdapterFuncSpec = BaseFunctionSpec & {
  type: 'render_property_function_spec',
};

export type RenderPropertyAdapter<T> = T extends Serialized ?
  RenderPropertyAdapterFuncSpec :
  (...args: unknown[]) => Record<string, unknown>;

export type ParamsBuilder<T> = T extends Serialized ?
  ParamsBuilderFuncSpec : (...args: unknown[]) => FetchParams;

export type ParamsBuilderFuncSpec = BaseFunctionSpec & {
  type: 'param_builder_func_spec';
}

export type LifecycleHookFuncSpec = BaseFunctionSpec & {
  type: 'lifecycle_hook_func_spec';
  args: '';
}

export type BaseFunctionSpec = {
  type: string;
  args: string;
  body: string;
}

export type FetchOption = {
  params?: FetchParams;
  // Callback is the hook for performing side effect after an API request.
  //
  // Why use callback style hook instead of Promise style?
  //
  // Every node should be equal, but some nodes are more equal than others.
  // In Pro-Code scenario, we can carefully design a Model to handle view actions and perform API request,
  // we also can carefully design some FLAG state to prevent extra API request or an complex cancellation mechanism.
  // These solutions may not be difficult for experienced programmers,
  // but our goal of building low-code platform is to enable junior programmers, even non-programmers,
  // to develop complex applications quickly and easily.
  // To solve this problem, we use `rxjs/ajax` to implement automatic cancellation of requests.
  // Doing so led us to a small problem, we can not use Promise style hook.
  // As said at the beginning, every node should be equal,
  // so every node could perform a side effect after some API request,
  // and if we use a Promise style hook,
  // there must will be some hooks will never be called and stay in pending status forever,
  // just like the following code:
  //
  //   new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       // resolve will never be called
  //       resolve();
  //     }, forever);
  //   });
  //
  // We, the developers, design a action which has a side effect,
  // but user make the finial decision when to trigger that action.
  // Side effect could be perform as many times as wanted,
  // but only under user's expectation.
  // When user trigger the *same action* many times,
  // only the last one should perform side effect.
  //
  // ps. Same actions means they have the same API stateID.
  callback?: APIFetchCallback;
}

export interface StatesHubAPI {
  hasState$: (stateID: string) => boolean;
  findState$: (stateID: string) => APIState$WithActions | undefined;
  getState$: (stateID: string) => BehaviorSubject<APIState>;
  fetch: (stateID: string, fetchOption: FetchOption) => void;
  refresh: (stateID: string) => void;
}

export type APIState$WithActions = {
  state$: BehaviorSubject<APIState>;
  fetch: (fetchOption: FetchOption) => void;
  refresh: () => void;
};

export type APIFetchCallbackSpec = BaseFunctionSpec & {
  type: 'api_fetch_callback';
  args: '{ result, error }',
}

export type APIFetchCallback = (state: Omit<APIState, 'loading'>) => void;
export type APIFetch = (params: FetchParams, callback?: APIFetchCallback) => void;

export interface StatesHubShared {
  hasState$: (stateID: string) => boolean;
  findState$: (stateID: string) => BehaviorSubject<unknown> | undefined;
  getState$: (stateID: string) => BehaviorSubject<unknown>;
  getNodeState$: (nodeKey: string) => BehaviorSubject<unknown>;
  exposeNodeState: (nodeKey: React.Key, state: unknown) => void;
  mutateState: (stateID: string, state: unknown) => void;
}

export type APIStateWithFetch = APIState & {
  fetch: APIFetch;
  refresh: () => void;
}

export type CTX = {
  statesHubAPI: StatesHubAPI;
  statesHubShared: StatesHubShared;
  apiStates: Readonly<Record<string, APIStateWithFetch>>;
  states: Record<string, unknown>;
  repository?: Repository;
  refLoader?: RefLoader;
}

export type RenderEngineCTX = Pick<CTX, 'states' | 'apiStates'>;

export type VersatileFunc<T = unknown> = (...args: unknown[]) => T;

export type LifecycleHooks<T extends Serialized | Instantiated> = Partial<{
  didMount: T extends Serialized ? LifecycleHookFuncSpec : VersatileFunc;
  willUnmount: T extends Serialized ? LifecycleHookFuncSpec : VersatileFunc;
}>;

export const enum NodeType {
  HTMLNode = 'html-element',
  ReactComponentNode = 'react-component',
  LoopContainerNode = 'loop-container',
  ComposedNode = 'composed-node',
  RefNode = 'ref-node',
}

export interface BaseNode<T extends Serialized | Instantiated> {
  id: React.Key;
  type: NodeType;
  props?: NodeProperties<T>;
  lifecycleHooks?: LifecycleHooks<T>;
}

export interface HTMLNode<T extends Serialized | Instantiated> extends BaseNode<T> {
  type: NodeType.HTMLNode;
  name: string;
  children?: Array<SchemaNode<T>>;
}

export interface ReactComponentNode<T extends Serialized | Instantiated> extends BaseNode<T> {
  type: NodeType.ReactComponentNode;
  packageName: string;
  packageVersion: string;
  exportName: 'default' | string;
  supportStateExposure?: boolean;
  // not recommend, should avoid
  children?: Array<SchemaNode<T>>;
}

export type PlainState<T extends Serialized | Instantiated> =
  APIResultProperty<T> |
  SharedStateProperty<T> |
  NodeStateProperty<T> |
  ConstantProperty;

export interface LoopContainerNode<T extends Serialized | Instantiated> extends BaseNode<T> {
  type: NodeType.LoopContainerNode;
  // props: LoopContainerNodeProps<T>;
  iterableState: PlainState<T>;
  loopKey: string;
  node: SchemaNode<T>;
  toProps: ToProps<T>;
}

export type ComposedNodeChild<T extends Serialized | Instantiated> = SchemaNode<T> & {
  toProps?: ToProps<T>;
}

export interface ComposedNode<T extends Serialized | Instantiated> extends BaseNode<T> {
  type: NodeType.ComposedNode;
  outLayer?: Omit<HTMLNode<T>, 'children'>;
  composedState: PlainState<T>;
  children: Array<ComposedNodeChild<T>>;
}

export interface RefNode<T extends Serialized | Instantiated> extends BaseNode<T> {
  type: NodeType.RefNode;
  schemaID: string;
  fallback?: SchemaNode<T>;
  // RefNode will inherit parent context,
  // which means use states if not found in current context.
  // set `orphan` to `true` to disable inheritance
  orphan?: boolean;
}

export type SchemaNode<T extends Serialized | Instantiated> =
  HTMLNode<T> |
  ReactComponentNode<T> |
  LoopContainerNode<T> |
  ComposedNode<T> |
  RefNode<T>;

// map of stateID and apiID
// todo should also store builder info
export type APIStatesSpec = Record<string, { apiID: string; [key: string]: unknown; }>;

export type SharedStatesSpec = Record<string, { initial: unknown; }>;

export type Schema = {
  node: SchemaNode<Serialized>;
  apiStateSpec?: APIStatesSpec;
  sharedStatesSpec?: SharedStatesSpec;
}

export type InstantiatedNode = SchemaNode<Instantiated>;

// todo fixme
export type DynamicComponent = React.FC<any> | React.ComponentClass<unknown>;

type PackageNameVersion = string;
export type Repository = Record<PackageNameVersion, Record<string, DynamicComponent>>;

export type RefLoader = (schemaID: string) => Promise<InitProps>;

export type InitProps = {
  schema: Schema;
  apiSpecAdapter: APISpecAdapter;
  repository?: Repository;
  refLoader?: RefLoader;
}
