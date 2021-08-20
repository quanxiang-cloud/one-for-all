import { RequestParams } from '@ofa/spec-interpreter/src/types';

type StringSelector = string;
type Selector<T> = StringSelector | ((data: any) => T);

type ElementIdentifier = string;

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
  convertor?: (res?: APIState) => T;
}

export type APIInvokeProperty = {
  type: 'api_invoke_property';
  stateID: string;
  convertor: (...args: any[]) => RequestParams;
  onSuccess?: (state: APIState) => void;
  onError?: (state: APIState) => void;
}

interface Node {
  key: string;
  type: 'html-element' | 'react-component';
  props: Record<string, ConstantProperty | APIDerivedProperty | APIInvokeProperty>;
  children?: Node[];
}

interface HTMLNode extends Node {
  type: 'html-element';
  name: string;
}

interface ReactComponentNode extends Node {
  type: 'react-component';
  packageName: string;
  packageVersion: string;
  exportName: 'default' | string;
  // not recommend, should avoid
  // subModule?: string;
}

type Schema = {
  element: ElementIdentifier;
  props: {
    key: React.Key;
    [key: string]: unknown;
  };
  children?: Array<Schema | string>;
}

interface Document {
  adoptedStyleSheets: any[];
}

type DynamicComponent = React.FC<any> | React.ComponentClass<any>;

type LocalStateProp = {
  type: 'local';
  default: any;
}

