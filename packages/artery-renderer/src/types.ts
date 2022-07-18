import React from 'react';
import type { BehaviorSubject } from 'rxjs';
import type { FetchParams, APISpecAdapter, AjaxConfig } from '@one-for-all/api-spec-adapter';
import type { BrowserHistory, Location } from 'history';
import type { APILoadingProperty, ConstantProperty } from '@one-for-all/artery';
import ArterySpec from '@one-for-all/artery';

export type VersatileFunc<T = unknown> = (...args: unknown[]) => T;

/**
 * Convertor is used to transform the state, such as API Result, before passing it to node.
 *
 * Convertor will NOT be called if the state is nullish, for example API request failed or the result is `null`.
 */
export type StateConvertor = (v: unknown) => unknown;

/**
 * LifecycleHooks provide a opportunity to executive some side-effects when node
 * `didMount` and `willUnmount`.
 */
export type LifecycleHooks = Partial<{
  didMount: VersatileFunc;
  willUnmount: VersatileFunc;
}>;

/**
 * toProps function should return Record<string, unknown>;
 */
export type ToProps = (state: unknown) => Record<string, unknown>;

export type NodeProperty =
  | ConstantProperty
  | APIResultProperty
  | APILoadingProperty
  | SharedStateProperty
  | NodeStateProperty
  | FunctionalProperty
  | SharedStateMutationProperty
  | APIInvokeProperty
  | RenderProperty
  | ComputedProperty
  | InheritedProperty;

export type PlainState = APIResultProperty | SharedStateProperty | NodeStateProperty | ConstantProperty;

/**
 * APIResultProperty define a value converted from API response.
 */
export interface APIResultProperty extends Omit<ArterySpec.APIResultProperty, 'convertor'> {
  convertor?: StateConvertor;
}

export interface SharedStateProperty extends Omit<ArterySpec.SharedStateProperty, 'convertor'> {
  convertor?: StateConvertor;
}

export interface NodeStateProperty extends Omit<ArterySpec.NodeStateProperty, 'convertor'> {
  convertor?: StateConvertor;
}

export interface FunctionalProperty extends Omit<ArterySpec.FunctionalProperty, 'func'> {
  func: VersatileFunc;
}

/**
 * @deprecated This type has been deprecated, please use FunctionalProperty instead
 */
export interface SharedStateMutationProperty
  extends Omit<ArterySpec.SharedStateMutationProperty, 'convertor'> {
  convertor?: VersatileFunc;
}

/**
 * @deprecated This type has been deprecated, please use FunctionalProperty instead
 */
export interface APIInvokeProperty extends Omit<ArterySpec.APIInvokeProperty, 'paramsBuilder' | 'callback'> {
  // the required return type is too complex
  paramsBuilder?: (...args: unknown[]) => FetchParams;
  callback?: APIFetchCallback;
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
export interface RenderProperty extends Omit<ArterySpec.RenderProperty, 'adapter' | 'node'> {
  adapter: (...args: unknown[]) => Record<string, unknown>;
  node: ArteryNode;
}

export interface ComputedProperty extends Omit<ArterySpec.ComputedProperty, 'convertor'> {
  convertor: StateConvertor;
}

export interface InheritedProperty extends Omit<ArterySpec.InheritedProperty, 'convertor'> {
  convertor?: StateConvertor;
}

export type NodeProperties = Record<string, NodeProperty>;

export type ArteryNode =
  | HTMLNode
  | LinkNode
  | ReactComponentNode
  | LoopContainerNode
  | ComposedNode
  | RefNode
  | JSXNode
  | RouteNode;

export type ShouldRenderCondition =
  | APIResultProperty
  | NodeStateProperty
  | SharedStateProperty
  | ComputedProperty
  | (ArterySpec.APILoadingProperty & { revert?: boolean });

export interface BaseNode extends Omit<ArterySpec.BaseNode, 'props' | 'shouldRender' | 'lifecycleHooks'> {
  props?: NodeProperties;
  shouldRender?: ShouldRenderCondition;
  lifecycleHooks?: LifecycleHooks;
}

export interface HTMLNode extends BaseNode, Pick<ArterySpec.HTMLNode, 'name'> {
  type: 'html-element';
  children?: Array<ArteryNode>;
}

export interface LinkNode extends HTMLNode {
  name: 'a';
  isLink: true;
}

export interface ReactComponentNode
  extends BaseNode,
    Pick<
      ArterySpec.ReactComponentNode,
      'packageName' | 'packageVersion' | 'exportName' | 'supportStateExposure'
    > {
  type: 'react-component';
  children?: Array<ArteryNode>;
}

export interface RouteNode extends BaseNode {
  type: 'route-node';
  path: string;
  node: ArteryNode;
  exactly?: boolean;
}

export interface IndividualLoopContainer extends BaseNode, Pick<ArterySpec.LoopContainerNode, 'loopKey'> {
  type: 'loop-container';
  iterableState: PlainState;
  node: ArteryNode;
  toProps: ToProps;
}

export interface ComposedNodeLoopContainer extends BaseNode, Pick<ArterySpec.LoopContainerNode, 'loopKey'> {
  type: 'loop-container';
  iterableState: PlainState;
  node: ComposedNode;
}

export type LoopContainerNode = IndividualLoopContainer | ComposedNodeLoopContainer;

export type ComposedNodeChild = ArteryNode & {
  toProps: ToProps;
};

export type ComposeOutLayer = Omit<HTMLNode, 'children'> | Omit<ReactComponentNode, 'children'>;

export interface ComposedNode extends BaseNode {
  type: 'composed-node';
  outLayer?: ComposeOutLayer;
  children?: Array<ComposedNodeChild>;
  nodes: Array<ComposedNodeChild>;
}

export interface RefNode extends BaseNode, Pick<ArterySpec.RefNode, 'arteryID' | 'orphan'> {
  type: 'ref-node';
  fallback?: ArteryNode;
}

export interface JSXNode extends BaseNode, Pick<ArterySpec.JSXNode, 'jsx'> {
  type: 'jsx-node';
}

export interface FetchOption {
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

export type RawFetchOption = Pick<AjaxConfig, 'method' | 'url' | 'body' | 'headers'>;

// APIState define the type of API results from view perspective.
// This type is inspired by [react-query](https://react-query.tanstack.com/).
export interface APIState {
  loading: boolean;
  result?: unknown;
  error?: Error;
}

export interface StatesHubAPI {
  hasState$: (stateID: string) => boolean;
  findState$: (stateID: string) => APIState$WithActions | undefined;
  getState$: (stateID: string) => BehaviorSubject<APIState>;
  fetch: (stateID: string, fetchOption: FetchOption) => void;
  rawFetch: (stateID: string, rawFetchOption: RawFetchOption & { callback?: APIFetchCallback }) => void;
  refresh: (stateID: string) => void;
}

export interface APIState$WithActions {
  state$: BehaviorSubject<APIState>;
  fetch: (fetchOption: FetchOption) => void;
  refresh: () => void;
  rawFetch: (rawFetchOption: RawFetchOption & { callback?: APIFetchCallback }) => void;
}

export type APIFetchCallback = (state: Omit<APIState, 'loading'>) => void;
export type APIFetch = (params: FetchParams, callback?: APIFetchCallback) => void;

export interface StatesHubShared {
  hasState$: (stateID: string) => boolean;
  findState$: (stateID: string) => BehaviorSubject<unknown> | undefined;
  getState$: (stateID: string) => BehaviorSubject<unknown>;
  getNodeState$: (nodePath: string) => BehaviorSubject<unknown>;
  exposeNodeState: (nodePath: string, state: unknown) => void;
  mutateState: (stateID: string, state: unknown) => void;
}

export interface APIStateWithFetch extends APIState {
  fetch: APIFetch;
  rawFetch: (rawFetchOption: RawFetchOption, callback?: APIFetchCallback) => void;
  refresh: () => void;
}

export interface NodePropsCache {
  getProps$: (parentID: string) => BehaviorSubject<Record<string, unknown>> | undefined;
  setProps: (path: string, nodeID: ArteryNode['id'], props: Record<string, unknown>) => void;
  shouldCache: (nodeID: string) => boolean;
}
export interface CTX {
  statesHubAPI: StatesHubAPI;
  statesHubShared: StatesHubShared;
  apiStates: Readonly<Record<string, APIStateWithFetch>>;
  states: Record<string, unknown>;
  location$: BehaviorSubject<Location>;
  history: BrowserHistory;
  nodePropsCache: NodePropsCache;

  plugins: Plugins;
}

export type ArteryRendererCTX = Pick<CTX, 'states' | 'apiStates'> & {
  history: BrowserHistory;
};

// map of stateID and apiID
export type APIStatesSpec = Record<string, { apiID: string; [key: string]: unknown }>;

export type InitializerFunc = (dependencies: Record<string, unknown>) => Promise<unknown> | unknown;

interface Initializer {
  func: InitializerFunc;
  dependencies?: {
    [key: string]: FetchParams;
  };
}

export type SharedState = Omit<ArterySpec.SharedState, 'initializer'> & {
  initializer?: Initializer;
};

export type SharedStatesSpec = Record<string, SharedState>;

export interface Artery {
  node: ArteryNode;
  apiStateSpec?: APIStatesSpec;
  sharedStatesSpec?: SharedStatesSpec;
}

// todo fixme
export type DynamicComponent = React.FC<any> | React.ComponentClass<unknown>;

type PackageNameVersion = string;
export type Repository = Record<PackageNameVersion, Record<string, DynamicComponent>>;

export type RefLoader = (arteryID: string) => Promise<{ artery: ArterySpec.Artery; plugins?: Plugins }>;

export interface ComponentLoaderParam {
  packageName: string;
  packageVersion: string;
  exportName: string;
}

export type ComponentLoader = (locator: ComponentLoaderParam) => Promise<DynamicComponent>;

export interface Plugins {
  apiSpecAdapter?: APISpecAdapter;
  repository?: Repository;
  refLoader?: RefLoader;
  componentLoader?: ComponentLoader;
}
