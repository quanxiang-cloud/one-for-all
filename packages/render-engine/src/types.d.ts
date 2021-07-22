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
