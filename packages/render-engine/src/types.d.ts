import { OpenAPIV3 } from 'openapi-types';
import { BehaviorSubject, Observable } from 'rxjs';
import APIStateHub from './api-state-hub';

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

type ConstantProperty = {
  type: 'constant_property';
  value: any;
}

type RawFunctionSpec = {
  type: string;
  args: string;
  body: string;
}

export type APIStateConvertFuncSpec = RawFunctionSpec & {
  type: 'api_state_mapper_func_spec';
  args: '{ data, error, loading, params }';
};

export type ParamsBuilderFuncSpec = RawFunctionSpec & {
  type: 'param_builder_func_spec';
}

export type APIInvokeCallbackFuncSpec = RawFunctionSpec & {
  type: 'api_invoke_call_func_spec';
  args: '{ data, error, loading, params }';
}

export type LocalStateConvertFuncSpec = RawFunctionSpec & {
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

export type APIDerivedProperty<T> = {
  type: 'api_derived_property';
  initialValue: any;
  stateID: string;
  template?: APIStateConvertor<T>;
}

export type APIInvokeProperty<T> = {
  type: 'api_invoke_property';
  stateID: string;
  // the required return type is too complex
  paramsBuilder?: ParamsBuilder<T>;
  onSuccess?: APIInvokeCallBack<T>;
  onError?: APIInvokeCallBack<T>;
}

export type LocalStateProperty<T> = {
  type: 'local_state_property';
  // this is not a good design
  stateID: string;
  template?: LocalStateConvertor<T>;
}

export type SetLocalStateProperty<T> = {
  type: 'set_local_state_property';
  stateID: string;
  callbacks?: Array<() => void>;
}

export type FunctionProperty<T> = {
  type: 'raw_function_property';
  spec: T extends Serialized ? RawFunctionSpec : (...args: any) => void;
}

export type NodeProperty<T> =
  ConstantProperty |
  APIDerivedProperty<T> |
  LocalStateProperty<T> |
  FunctionProperty<T> |
  SetLocalStateProperty<T> |
  APIInvokeProperty<T> |
  Array<APIInvokeProperty<T>>;

export type NodeProperties<T> = Record<string, NodeProperty<T>>;

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

declare global {
  interface Window {
    stateHub: APIStateHub;
  }
}
