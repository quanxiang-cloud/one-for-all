import type { Spec, Operation } from './swagger-schema-official';

import type { APISpecAdapter, AjaxConfig, FetchParams } from './types';
import { indexOperation, join } from './utils';

export default class SwaggerSpecAdapter implements APISpecAdapter {
  spec: Spec;
  operationMap: Record<string, Operation>;

  constructor(spec: Spec) {
    this.operationMap = indexOperation(spec);
    this.spec = spec;
  }

  build(apiID: string, fetchParams?: FetchParams): AjaxConfig | undefined {
    const [method, path] = apiID.split(':');
    const operation: Operation = this.operationMap[apiID];

    if (!operation) {
      throw new Error(`can not find operation for path: ${path}, method: ${method}.`);
    }

    let url = join(this.spec.basePath || '', path);
    const queryParams: Record<string, any> = {};
    const headers: Record<string, any> = {};
    // todo return undefined and log error message
    // when the params do not meet the api requirements
    operation.parameters?.forEach((p) => {
      if ('$ref' in p) {
        // TODO: support reference object
        return;
      }

      if (p.in === 'path' && fetchParams?.params?.[p.name]) {
        // if (p.required && fetchParams?.params?.[p.name] === undefined) {
        //   throw new Error(`parameter '${p.name}' required in path for ${operationID}`);
        // }

        url = url.replace(`{${p.name}}`, fetchParams.params[p.name]);
      }

      if (p.in === 'query' && fetchParams?.params?.[p.name] !== undefined) {
        queryParams[p.name] = fetchParams.params[p.name];
      }

      if (p.in === 'header' && fetchParams?.params?.[p.name] !== undefined) {
        headers[p.name] = fetchParams.params[p.name];
      }
    });

    return { method, url, queryParams, headers, body: fetchParams?.body };
  }
}
