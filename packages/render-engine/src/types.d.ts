import { RequestParams } from '@ofa/spec-interpreter/src/types';
import StateHub from './state-hub';

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

export type APIDerivedProperty<T = any> = {
  type: 'api_derived_property';
  initialValue: T;
  stateID: string;
  convertor?: (apiState: APIState) => T;
}

export type APIInvokeProperty = {
  type: 'api_invoke_property';
  stateID: string;
  convertor: (...args: any[]) => RequestParams;
  onSuccess?: (state: APIState) => void;
  onError?: (state: APIState) => void;
}

export type NodeProps = Record<string,
  ConstantProperty | APIDerivedProperty | APIInvokeProperty | Array<APIInvokeProperty>
>;

interface BaseNode {
  key: string;
  type: 'html-element' | 'react-component';
  props?: NodeProps;
  children?: BaseNode[];
}

interface HTMLNode extends BaseNode {
  type: 'html-element';
  name: string;
  children?: Array<SchemaNode>;
}

interface ReactComponentNode extends BaseNode {
  type: 'react-component';
  packageName: string;
  packageVersion: string;
  exportName: 'default' | string;
  // not recommend, should avoid
  // subModule?: string;
  children?: Array<SchemaNode>;
}

type SchemaNode = HTMLNode | ReactComponentNode;

export type StatesMap = Record<string, {
  operationID: string;
  [key: string]: any;
}>;

export type Schema = {
  node: SchemaNode;
  statesMap: StatesMap;
}

interface Document {
  adoptedStyleSheets: any[];
}

type DynamicComponent = React.FC<any> | React.ComponentClass<any>;

type LocalStateProp = {
  type: 'local';
  default: any;
}

declare global {
  interface Window {
    stateHub: StateHub;
  }
}
