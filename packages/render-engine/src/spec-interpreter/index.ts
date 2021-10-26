import { set } from 'lodash';
import type { OpenAPIV3 } from 'openapi-types';

import type { RequestConfig, RequestParams } from '../types';

type OperationSpec = {
  path: string;
  method: OpenAPIV3.HttpMethods;
  parameters?: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[];
  requestBody?: OpenAPIV3.ReferenceObject | OpenAPIV3.RequestBodyObject;
}

enum HttpMethods {
  GET = 'get',
  PUT = 'put',
  POST = 'post',
  DELETE = 'delete',
  OPTIONS = 'options',
  HEAD = 'head',
  PATCH = 'patch',
  TRACE = 'trace'
}

const METHODS = Object.values(HttpMethods);

function indexOperation(apiDoc: OpenAPIV3.Document): Record<string, OperationSpec | undefined> {
  const operationIDMap: Record<string, OperationSpec | undefined> = {};
  for (const [path, pathItemObject] of Object.entries(apiDoc.paths)) {
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

class SpecInterpreter {
  docComponents: OpenAPIV3.ComponentsObject | undefined;
  operationMap: Record<string, OperationSpec | undefined>;

  constructor(apiDoc: OpenAPIV3.Document) {
    this.operationMap = indexOperation(apiDoc);
    this.docComponents = apiDoc.components;
  }

  buildRequest(operationID: string, requestParam?: RequestParams): RequestConfig {
    const operationSpec = this.operationMap[operationID];
    if (!operationSpec) {
      throw new Error(`can not find spec for operation: ${operationID}`);
    }

    const { path, method, parameters } = operationSpec;
    const requestConfig: RequestConfig = { method, path };

    parameters?.forEach((p) => {
      if ('$ref' in p) {
        // TODO: support reference object
        return;
      }

      if (p.in === 'path') {
        if (p.required && requestParam?.params?.[p.name] === undefined) {
          throw new Error(`parameter '${p.name}' required in path for ${operationID}`);
        }

        requestConfig.path = requestConfig.path.replace(`{${p.name}}`, requestParam?.params?.[p.name]);
      }

      if (p.in === 'query') {
        if (p.required && requestParam?.params?.[p.name] === undefined) {
          throw new Error(`parameter '${p.name}' required in query for ${operationID}`);
        }

        if (requestParam?.params?.[p.name] !== undefined) {
          set(requestConfig, `query.${p.name}`, requestParam?.params?.[p.name]);
        }
      }

      if (p.in === 'header') {
        if (p.required && requestParam?.params?.[p.name] === undefined) {
          throw new Error(`parameter '${p.name}' required in header for ${operationID}`);
        }

        if (requestParam?.params?.[p.name] !== undefined) {
          set(requestConfig, `header.${p.name}`, requestParam?.params?.[p.name]);
        }
      }
    });

    requestConfig.body = requestParam?.body;

    return requestConfig;
  }
}

export default SpecInterpreter;
