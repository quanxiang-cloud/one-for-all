import { RequestParams } from '@ofa/spec-interpreter/src/types';

type StringSelector = string;
type Selector<T> = StringSelector | ((data: any) => T);

type ElementIdentifier = string;

export type APIState = {
  params: RequestParams;
  loading: boolean;
  data?: any;
  error?: string;
};

export type ResultDerivedProperty<T = any> = {
  type: 'result_derived_property';
  initialValue: T;
  stateID: string;
  convertor?: (res?: APIState) => T;
}

export type APIInvokeProperty<T = any> = {
  type: 'api_invoke_property';
  stateID: string;
  convertor: (callbackParams: T) => RequestParams;
}

type APIReference = {
  apiID: string;
  requestConvert: (params: any) => void;
  responseConvert: (response: any) => any;
  groupID?: string;
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

interface Window {
  // todo fix this type
  OPEN_API_SPEC: any;
}

type ConstantProperty = {
  type: 'constant_property';
  value: any;
}

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
  props: Record<string, ResultDerivedProperty | LocalStateProp | CallbackProps>;
  // todo local state props
  children?: Component[];
}
