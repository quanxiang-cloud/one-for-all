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

type CallbackProps = Array<{
  type: 'callback';
  target: 'muteState' | 'api_call';
  // api stream or local state stream
  stateID: string;
}>;

type Component = {
  componentID: string;
  type: 'html-element' | 'react-element' | 'layout-component';
  props: Record<string, APIDerivedProperty | LocalStateProp | CallbackProps>;
  // todo local state props
  children?: Component[];
}
