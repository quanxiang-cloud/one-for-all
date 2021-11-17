import { BehaviorSubject, Observable } from 'rxjs';
import NodeStateHub from './ctx/node-state-hub';

export type Serialized = 'Serialized';
export type Instantiated = 'Instantiated';

// the shape of RequestParams is too complex
export type RequestParams = Partial<{
  params: Record<string, any>;
  body: any;
}> | undefined;

export type APIState = {
  params: RequestParams;
  loading: boolean;
  data?: any;
  error?: Error;
};

export const enum NodePropType {
  ConstantProperty = 'constant_property',
  APIDerivedProperty = 'api_derived_property',
  SharedStateProperty = 'shared_state_property',
  FunctionalProperty = 'functional_property',
  SharedStateMutationProperty = 'shared_state_mutation_property',
  NodeStateProperty = 'node_state_property',

  APIInvokeProperty = 'api_invoke_property',
}

export type NodeProperty<T> =
  ConstantProperty |
  APIDerivedProperty<T> |
  SharedStateProperty<T> |
  FunctionalProperty<T> |
  SharedStateMutationProperty<T> |
  NodeStateProperty<T> |
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

export type APIDerivedProperty<T> = BaseNodeProperty & {
  type: NodePropType.APIDerivedProperty;
  // in the previous implementation, this property is called: initialValue,
  // why changed to `fallback`?
  // - please refer to API State Table, it's hard to modify the `data` to initialValue in the second stage
  // - always defining a fallback value for API response is best practices,
  //   no matter before API result returned or encounter a API error.
  fallback: any;
  stateID: string;
  // todo define different type adapter
  adapter?: APIStateAdapter<T>;
}

export type SharedStateProperty<T> = BaseNodeProperty & {
  type: NodePropType.SharedStateProperty;
  // this is not a good design
  stateID: string;
  // todo define different type adapter
  adapter?: RawStateAdapter<T>;
  fallback: any;
}

export type FunctionalProperty<T> = BaseNodeProperty & {
  type: NodePropType.FunctionalProperty;
  func: T extends Serialized ? BaseFunctionSpec : VersatileFunc;
}

// todo refactor this type property spec
export type SharedStateMutationProperty<T> = {
  type: NodePropType.SharedStateMutationProperty;
  stateID: string;
  adapter?: T extends Serialized ? RawFunctionSpec : VersatileFunc;
}

// todo refactor this type property spec
export type APIInvokeProperty<T> = {
  type: NodePropType.APIInvokeProperty;
  stateID: string;
  // the required return type is too complex
  paramsBuilder?: ParamsBuilder<T>;
  onSuccess?: APIInvokeCallBack<T>;
  onError?: APIInvokeCallBack<T>;
}

export type NodeStateProperty<T> = BaseNodeProperty & {
  type: NodePropType.NodeStateProperty;
  nodeKey: string;
  fallback: any;
  adapter?: RawStateAdapter<T>;
}

type BaseFunctionSpec = {
  type: string;
  args: string;
  body: string;
}

export type RawFunctionSpec = BaseFunctionSpec & {
  type: 'raw';
}

export type ParamsBuilderFuncSpec = BaseFunctionSpec & {
  type: 'param_builder_func_spec';
}

export type APIInvokeCallbackFuncSpec = BaseFunctionSpec & {
  type: 'api_invoke_call_func_spec';
  args: '{ data, error, loading, params }';
}

export type RawDataConvertorSpec = BaseFunctionSpec & {
  type: 'raw_data_convert_func_spec';
  // `data` is unacceptable!
  args: 'data';
}

export type RunParam = {
  params?: RequestParams;
  onSuccess?: APIInvokeCallBack<Instantiated>;
  onError?: APIInvokeCallBack<Instantiated>;
}

export interface APIStates {
  runAction: (stateID: string, runParam?: RunParam) => void;
  refresh: (stateID: string) => void;
  getState: (stateID: string) => Observable<APIState>;
  getAction: (stateID: string) => (runParam?: RunParam) => void;
}

export interface SharedStates {
  getState$: (stateID: string) => BehaviorSubject<any>;
  initContext: (ctx: CTX) => void;
}

export type CTX = {
  apiStates: APIStates;
  sharedStates: SharedStates;
  nodeStates: NodeStateHub;
}

export type APIStateConvertor = (state: APIState) => any;

export type APIStateTemplate = {
  type: 'api_state_template';
  // template for data, loading, params, error
  // {{ data.foo }}
  // {{ data.offset / (data.limit + data.offset) }}
  // {{ data.list.map((item) => item.name)) }}
  // {{ data.list.map((item) => `名称：${item.name}`)) }}
  // {{ data.foo?.bar?.baz || 'someValue' }}
  template: string;
}

export type ExpressionStatement = {
  type: 'expression_statement';
  // template for data
  // {{ data.foo }}
  // {{ data.offset / (data.limit + data.offset) }}
  // {{ data.list.map((item) => item.name)) }}
  // {{ data.list.map((item) => `名称：${item.name}`)) }}
  // {{ data.foo?.bar?.baz || 'someValue' }}
  expression: string;
}

// todo refactor this type property spec
export type APIStateConvertFuncSpec = BaseFunctionSpec & {
  type: 'api_state_convertor_func_spec';
  args: '{ data, error, loading, params }';
};

export type SerializedAPIStateAdapter = APIStateTemplate | APIStateConvertFuncSpec;
export type SerializedRawStateAdapter = ExpressionStatement | RawDataConvertorSpec;

export type APIStateAdapter<T> = T extends Serialized ? SerializedAPIStateAdapter : APIStateConvertor;
export type RawStateAdapter<T> = T extends Serialized ? SerializedRawStateAdapter : VersatileFunc;
export type ParamsBuilder<T> = T extends Serialized ? ParamsBuilderFuncSpec : (...args: any[]) => RequestParams;
export type APIInvokeCallBack<T> = T extends Serialized ? APIInvokeCallbackFuncSpec : (apiState: APIState) => void;

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

// map of stateID and operationID
export type APIStateSpec = Record<string, {
  path: string;
  method: string;
  [key: string]: any;
}>;

export type SharedStatesSpec = Record<string, { initial: any; }>;

export type Schema = {
  node: SchemaNode<Serialized>;
  apiStateSpec: APIStateSpec;
  sharedStatesSpec: SharedStatesSpec;
}

export type InstantiatedNode = SchemaNode<Instantiated>;

interface Document {
  adoptedStyleSheets: any[];
}

export type DynamicComponent = React.FC<any> | React.ComponentClass<any>;
