import { OpenAPIV3 } from 'openapi-types';
import { BehaviorSubject, Observable } from 'rxjs';

export type Serialized = 'Serialized';
export type Instantiated = 'Instantiated';

// the shape of RequestParams is too complex
export type RequestParams = Partial<{
  params: Record<string, any>;
  body: any;
}> | undefined;

export type RequestConfig = {
  path: string;
  method: OpenAPIV3.HttpMethods;
  query?: Record<string, string>;
  header?: Record<string, string>;
  body?: any;
}

export type APIState = {
  params: RequestParams;
  loading: boolean;
  data?: any;
  error?: Error;
};

export type LocalState = {
  data?: any;
}

export enum ComponentPropType {
  ConstantProperty = 'constant_property',
  APIDerivedProperty = 'api_derived_property',
  LocalStateProperty = 'local_state_property',
  FunctionalProperty = 'functional_property',

  SetLocalStateProperty = 'set_local_state_property',
  APIInvokeProperty = 'api_invoke_property',
}

type NodeProperty<T> =
  ConstantProperty |
  APIDerivedProperty<T> |
  LocalStateProperty<T> |
  FunctionalProperty<T> |
  SetLocalStateProperty<T> |
  APIInvokeProperty<T> |
  Array<APIInvokeProperty<T>>;

type NodeProperties<T> = Record<string, NodeProperty<T>>;

type BaseComponentProperty = {
  type: ComponentPropType;
}

export type ConstantProperty = BaseComponentProperty & {
  type: ComponentPropType.ConstantProperty;
  value: any;
}

export type APIDerivedProperty<T> = BaseComponentProperty & {
  type: ComponentPropType.APIDerivedProperty;
  initialValue?: any;
  stateID: string;
  // todo define different type adapter
  adapter?: APIStateConvertor<T>;
}

export type LocalStateProperty<T> = BaseComponentProperty & {
  type: ComponentPropType.LocalStateProperty;
  // this is not a good design
  stateID: string;
  // todo define different type adapter
  adapter?: LocalStateConvertor<T>;
}

export type FunctionalProperty<T> = BaseComponentProperty & {
  type: ComponentPropType.FunctionalProperty;
  func: T extends Serialized ? BaseFunctionSpec : VersatileFunc;
}

// todo refactor this type property spec
export type APIStateConvertFuncSpec = BaseFunctionSpec & {
  type: 'api_state_mapper_func_spec';
  args: '{ data, error, loading, params }';
};

// todo refactor this type property spec
export type SetLocalStateProperty<T> = {
  type: ComponentPropType.SetLocalStateProperty;
  stateID: string;
  callbacks?: Array<() => void>;
}

// todo refactor this type property spec
export type APIInvokeProperty<T> = {
  type: ComponentPropType.APIInvokeProperty;
  stateID: string;
  // the required return type is too complex
  paramsBuilder?: ParamsBuilder<T>;
  onSuccess?: APIInvokeCallBack<T>;
  onError?: APIInvokeCallBack<T>;
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

export type LocalStateConvertFuncSpec = BaseFunctionSpec & {
  type: 'local_state_convert_func_spec';
  // `data` is unacceptable!
  args: '{ data, ctx }';
}

type RunParam = {
  params?: RequestParams;
  onSuccess?: APIInvokeCallBack<Instantiated>;
  onError?: APIInvokeCallBack<Instantiated>;
}

export interface APIStateContext {
  runAction: (stateID: string, runParam?: RunParam) => void;
  refresh: (stateID: string) => void;
  getState: (stateID: string) => Observable<APIState>;
  getAction: (stateID: string) => (runParam?: RunParam) => void;
}

export interface LocalStateContext {
  getState$: (stateID: string) => BehaviorSubject<any>;
}

export type CTX = {
  apiStateContext: APIStateContext;
  localStateContext: LocalStateContext;
}

export type APIStateConvertFunc = (apiState: APIState) => any;
export type LocalStateConvertFunc = (data: any) => any;

export type APIStateConvertor<T> = T extends Serialized ? APIStateConvertFuncSpec : APIStateConvertFunc;
export type LocalStateConvertor<T> = T extends Serialized ? LocalStateConvertFuncSpec : LocalStateConvertFunc;
export type ParamsBuilder<T> = T extends Serialized ? ParamsBuilderFuncSpec : (...args: any[]) => RequestParams;
export type APIInvokeCallBack<T> = T extends Serialized ? APIInvokeCallbackFuncSpec : (apiState: APIState) => void;

type VersatileFunc = (...args: any) => any;

interface BaseNode<T> {
  key: string;
  type: 'html-element' | 'react-component';
  props?: NodeProperties<T>;
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

type SchemaNode<T> = HTMLNode<T> | ReactComponentNode<T>;

// map of stateID and operationID
export type APIStateSpec = Record<string, {
  operationID: string;
  [key: string]: any;
}>;

export type LocalStateSpec = Record<string, { initial: any; }>;

export type Schema = {
  node: SchemaNode<Serialized>;
  apiStateSpec: APIStateSpec;
  localStateSpec: LocalStateSpec;
}

export type InstantiatedSchema = {
  node: SchemaNode<Instantiated>;
  apiStateSpec: APIStateSpec;
  localStateSpec: LocalStateSpec;
};

interface Document {
  adoptedStyleSheets: any[];
}

type DynamicComponent = React.FC<any> | React.ComponentClass<any>;
