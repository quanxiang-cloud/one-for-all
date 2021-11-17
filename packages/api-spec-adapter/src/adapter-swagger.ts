import type { Spec, Operation } from './swagger-schema-official';

import type { Adapter, AjaxConfig, RequestParams } from './types';
import { indexOperation } from './utils';

export default class SwaggerAdapter implements Adapter {
  operationMap: Record<string, Operation>;

  constructor(spec: Spec) {
    this.operationMap = indexOperation(spec);
  }

  build(path: string, method: string, requestParam?: RequestParams): AjaxConfig {
    const operation: Operation = this.operationMap[`${path}:${method}`];

    if (!operation) {
      throw new Error(`can not find operation for path: ${path}, method: ${method}`);
    }

    let url = path;
    const queryParams: Record<string, any> = {};
    const headers: Record<string, any> = {};

    operation.parameters?.forEach((p) => {
      if ('$ref' in p) {
        // TODO: support reference object
        return;
      }

      if (p.in === 'path' && requestParam?.params?.[p.name]) {
        // if (p.required && requestParam?.params?.[p.name] === undefined) {
        //   throw new Error(`parameter '${p.name}' required in path for ${operationID}`);
        // }

        url = url.replace(`{${p.name}}`, requestParam.params[p.name]);
      }

      if (p.in === 'query' && requestParam?.params?.[p.name] !== undefined) {
        // if (p.required && requestParam?.params?.[p.name] === undefined) {
        //   throw new Error(`parameter '${p.name}' required in query for ${operationID}`);
        // }

        queryParams[p.name] = requestParam.params[p.name];
      }

      if (p.in === 'header' && requestParam?.params?.[p.name] !== undefined) {
        headers[p.name] = requestParam.params[p.name];
      }
    });

    return { method, url, queryParams, headers, body: requestParam?.body };
  }
}
