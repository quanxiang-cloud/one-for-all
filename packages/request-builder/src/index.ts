import { get, set } from 'lodash';
import { OpenAPIV3 } from 'openapi-types';

type Method = 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch';
export type RequestConfig = {
  path: string;
  method: Method;
  query?: Record<string, string>;
  body?: any;
}
export type RequestParams = {
  params?: Record<string, any>;
  body?: any;
}

type PartialSchema = {
  path: string;
  method: Method;
  parameters?: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[];
  requestBody?: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject;
}

const METHODS: Method[] = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];

export default class Builder {
  schema: OpenAPIV3.Document;
  constructor(schema: OpenAPIV3.Document) {
    this.schema = schema;
  }

  fillRequest(operationId: string, requestParam?: RequestParams): RequestConfig | null {
    let schema: PartialSchema | undefined = undefined;
    for (const [path, pathItemObject] of Object.entries(this.schema.paths)) {
      if (!pathItemObject) {
        continue
      }

      const method = METHODS.find((method) => get(pathItemObject, `${method}.operationId`) === operationId);
      if (!method) {
        continue
      }

      const operationObject = pathItemObject[method as OpenAPIV3.HttpMethods];
      if (!operationObject) {
        continue
      }

      schema = { path, method, parameters: operationObject.parameters, requestBody: operationObject.requestBody };
      break;
    }

    if (!schema) {
      return null;
    }

    let { path, method, parameters, requestBody } = schema;
    const request: RequestConfig = { method, path };

    parameters?.forEach((p) => {
      if ('$ref' in p)  {
        // todo support reference object
        return;
      }

      if (p.in === 'path') {
        if (p.required && requestParam?.params?.[p.name] === undefined) {
          throw new Error(`parameter '${p.name}' required in path for ${operationId}`);
        }

        path = path.replace(`{${p.name}}`, requestParam?.params?.[p.name]);
      }

      if (p.in === 'query') {
        if (p.required && requestParam?.params?.[p.name] === undefined) {
          throw new Error(`parameter '${p.name}' required in query for ${operationId}`);
        }

        if (requestParam?.params?.[p.name] !== undefined) {
          set(request, `query.${p.name}`, requestParam?.params?.[p.name]);
        }
      }

      if (p.in === 'header') {
        if (p.required && requestParam?.params?.[p.name] === undefined) {
          throw new Error(`parameter '${p.name}' required in header for ${operationId}`);
        }

        if (requestParam?.params?.[p.name] !== undefined) {
          set(request, `header.${p.name}`, requestParam?.params?.[p.name]);
        }
      }
    });

    // todo support reference object
    if (requestBody && !('$ref' in requestBody)) {
      if (requestBody.required && requestParam?.body === undefined) {
        throw new Error(`body required for operation: ${operationId}`);
      }

      request.body = requestParam?.body;
    }

    return request;
  }
}
