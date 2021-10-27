import { OpenAPIV3 } from 'openapi-types';
import StateHub from './state-hub';

export type Serialized = 'Serialized';
export type Instantiated = 'Instantiated';

// the shape of RequestParams is too complicated
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

type ConstantProperty = {
  type: 'constant_property';
  value: any;
}

type FunctionSpec = {
  type: string;
  args: string;
  body: string;
}

export type APIStateConvertFuncSpec = FunctionSpec & {
  type: 'api_state_mapper_func_spec';
  args: 'apiState';
};

export type ParamsBuilderFuncSpec = FunctionSpec & {
  type: 'param_builder_func_spec';
}

export type APIInvokeCallbackFuncSpec = FunctionSpec & {
  type: 'api_invoke_call_func_spec';
  args: 'apiState';
}

export type APIStateConvertFunc = (apiState: APIState) => any;
type APIStateConvertor<T> = T extends Serialized ? APIStateConvertFuncSpec : APIStateConvertFunc;
type ParamsBuilder<T> = T extends Serialized ? ParamsBuilderFuncSpec : (...args: any[]) => RequestParams;
type APIInvokeCallBack<T> = T extends Serialized ? APIInvokeCallbackFuncSpec : (apiState: APIState) => void;

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

export type LocalStateProps<T> = {
  type: 'local_state_property';
  initialValue: any;
  stateID: string;
}

export type NodeProp<T> =
  ConstantProperty |
  APIDerivedProperty<T> |
  APIInvokeProperty<T> |
  Array<APIInvokeProperty<T>>;

export type NodeProps<T> = Record<string, NodeProp<T>>;

interface BaseNode<T> {
  key: string;
  type: 'html-element' | 'react-component';
  props?: NodeProps<T>;
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

export type StatesMap = Record<string, {
  operationID: string;
  [key: string]: any;
}>;

export type Schema = {
  node: SchemaNode<Serialized>;
  statesMap: StatesMap;
}

export type InstantiatedSchema = {
  node: SchemaNode<Instantiated>;
  statesMap: StatesMap;
};

interface Document {
  adoptedStyleSheets: any[];
}

type DynamicComponent = React.FC<any> | React.ComponentClass<any>;

declare global {
  interface Window {
    stateHub: StateHub;
  }
}
