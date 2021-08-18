import { OpenAPIV3 } from 'openapi-types';

// the shape of RequestParams is too complicated
export type RequestParams = Partial<{
  params: Record<string, any>;
  body: any;
}> | undefined;

export type RequestConfig = {
  path: string;
  method: OpenAPIV3.HttpMethods;
  query?: Record<string, string>;
  body?: any;
}
