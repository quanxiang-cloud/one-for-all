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

      operationMap[`${method}:${pathName}`] = operationObject;
    }
  }

  return operationMap;
}

// copied from https://gist.github.com/creationix/7435851#gistcomment-3698888
// return an absolute path
export function join(...segments: string[]): string {
  const parts = segments.reduce<string[]>((parts, segment) => {
    // Remove leading slashes from non-first part.
    // Remove trailing slashes.
    return parts.concat(segment.replace(/^\//, '').replace(/\/$/, '').split('/'));
  }, []);

  const resultParts = [];
  for (const part of parts) {
    if (part === '.') {
      continue;
    }
    if (part === '..') {
      resultParts.pop();
      continue;
    }
    resultParts.push(part);
  }
  return `/${resultParts.join('/')}`;
}
