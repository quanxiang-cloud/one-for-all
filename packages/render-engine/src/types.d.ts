type StringSelector = string;
type Selector<T> = StringSelector | ((data: any) => T);

type ElementIdentifier = string;

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

type ConstProp = {
  type: 'constant';
  value: any;
}

type APIProp = {
  type: 'api';
  defaultValue: any;
  streamID: string;
  responseConvert: (response: any) => any;
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
  props: Record<string, APIProp | LocalStateProp | CallbackProps>;
  // todo local state props
  children?: Component[];
}
