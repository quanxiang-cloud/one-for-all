type StringSelector = string;
type Selector<T> = StringSelector | ((data: any) => T);

type ElementIdentifier = string;

export type APIResult<T = any> = {
  params: import('@ofa/request-builder/src/types').RequestParams;
  body: T;
  loading: boolean;
  error: Error | undefined;
};

type APIResult$ = import('rxjs').Observable<APIResult>;

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

type OFASchema = {
  apiSchema: import('openapi-types').OpenAPIV3.Document;
  streams: Record<string, { apiID: string; }>;
  component: Component;
}

type ConstantProperty = {
  type: 'constant_property';
  value: any;
}

export type APIDerivedProperty<T = any, R = any> = {
  type: 'api_derived_property';
  initialValue: T;
  streamID: string;
  convertor: (res: APIResult<R>) => T;
}

export type APICallProperty<T = any> = {
  type: 'api_call_property';
  streamID: string;
  convertor: (callbackParams: T) => import('@ofa/request-builder/src/types').RequestParams;
}

type LocalStateProp = {
  type: 'local';
  default: any;
}

type CallbackProps = Array<{
  type: 'callback';
  target: 'muteState' | 'api_call';
  // api stream or local state stream
  streamID: string;
}>;

type Component = {
  componentID: string;
  type: 'html-element' | 'react-element' | 'layout-component';
  props: Record<string, APIDerivedProperty | LocalStateProp | CallbackProps>;
  // todo local state props
  children?: Component[];
}
