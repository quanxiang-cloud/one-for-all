import type { Spec, Operation } from './swagger-schema-official';

import { METHODS } from './types';

export function indexOperation(spec: Spec): Record<string, Operation> {
  const operationMap: Record<string, Operation> = {};
  for (const [pathName, pathObj] of Object.entries(spec.paths)) {
    if (!pathObj) {
      continue;
    }

    for (const method of METHODS) {
      const operationObject = pathObj[method];
      if (!operationObject) {
        continue;
      }

      operationMap[`${pathName}:${method}`] = operationObject;
    }
  }

  return operationMap;
}
