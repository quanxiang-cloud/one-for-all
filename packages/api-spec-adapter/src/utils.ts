import type { Spec, Operation } from './swagger-schema-official';

import { METHODS } from './types';

export function indexOperation(spec: Spec): Record<string, Operation> {
  const operationMap: Record<string, Operation> = {};
  for (const [pathName, pathObj] of Object.entries(spec.paths || {})) {
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
    const fragment = segment.replace(/^\//, '').replace(/\/$/, '');
    if (!fragment) {
      return parts;
    }

    const fragments = fragment.split('/');
    return parts.concat(fragments);
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

type KeyPathPair = [string, string | number | boolean | null];

function isPrimaryValue(v: unknown): boolean {
  return typeof v === 'boolean' ||
    typeof v === 'number' ||
    typeof v === 'string' ||
    v === null;
}

function shouldGoIn(v: unknown): boolean {
  return typeof v === 'object' && v !== null;
}

function _toKeyPathPair(v: unknown, pairs: Array<KeyPathPair>, parentPath: string): Array<KeyPathPair> {
  if (typeof v !== 'object' || v === null) {
    return [];
  }

  Object.entries(v).forEach(([key, value]) => {
    const keyPath = parentPath ? `${parentPath}.${key}` : key;
    if (isPrimaryValue(value)) {
      pairs.push([keyPath, value]);
      return;
    }

    if (!shouldGoIn(v)) {
      return;
    }

    _toKeyPathPair((v as any)[key], pairs, keyPath);
  });

  return pairs;
}

export function toKeyPathPair(v: unknown, prefix: string): Array<KeyPathPair> {
  return _toKeyPathPair(v, [], prefix);
}
