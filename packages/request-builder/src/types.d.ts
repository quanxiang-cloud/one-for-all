type APISchema = any;
type Method = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch';
type RequestConfig = {
  path: string;
  method: Method;
  query?: Record<string, string>;
  body?: any;
}

type RequestParams = {
  params?: Record<string, any>;
  body?: any;
}

type Builder = (apiSchema: APISchema, params?: Record<string, unknown>) => Request;
