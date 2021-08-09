import { set } from 'lodash';
import { OpenAPIV3 } from 'openapi-types';

export type RequestConfig = {
  path: string;
  method: OpenAPIV3.HttpMethods;
  query?: Record<string, string>;
  body?: any;
}
export type RequestParams = {
  params?: Record<string, any>;
  body?: any;
}

type PartialSchema = {
  path: string;
  method: OpenAPIV3.HttpMethods;
  parameters?: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[];
  requestBody?: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject;
}

function indexing(schema: OpenAPIV3.Document): Record<string, PartialSchema | undefined> {
  const operationIDMap: Record<string, PartialSchema | undefined> = {};
  for (const [path, pathItemObject] of Object.entries(schema.paths)) {
    if (!pathItemObject) {
      continue;
    }

    for (const method of METHODS) {
      const operationObject = pathItemObject[method];
      if (!operationObject) {
        continue;
      }

      operationIDMap[`${operationObject.operationId}`] = {
        path,
        method,
        parameters: operationObject.parameters,
        requestBody: operationObject.requestBody,
      };
    }
  }

  return operationIDMap;
}

const METHODS = Object.values(OpenAPIV3.HttpMethods);

export default class Builder {
  schema: OpenAPIV3.Document;
  operationIDMap: Record<string, PartialSchema | undefined>;

  constructor(schema: OpenAPIV3.Document) {
    this.schema = schema;
    this.operationIDMap = indexing(schema);
  }

  buildRequest(operationId: string, requestParam?: RequestParams): RequestConfig {
    const schema = this.operationIDMap[operationId];
    if (!schema) {
      throw new Error('can not find schema');
    }

    let { path, method, parameters, requestBody } = schema;
    const request: RequestConfig = { method, path };

    parameters?.forEach((p) => {
      if ('$ref' in p) {
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
