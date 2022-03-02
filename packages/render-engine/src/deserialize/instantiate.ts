import { instantiateFuncSpec, isObject, isFuncSpec } from './utils';

function instantiate(n: unknown, ctx: unknown): unknown {
  if (!isObject(n) || typeof n !== 'object' || n === null) {
    return n;
  }

  Object.entries(n).forEach(([key, v]) => {
    if (isFuncSpec(v)) {
      Reflect.set(n, key, instantiateFuncSpec(v, ctx));
      return;
    }

    if (isObject(v)) {
      Reflect.set(n, key, instantiate(v, ctx));
      return;
    }

    if (Array.isArray(v)) {
      Reflect.set(
        n,
        key,
        v.map((_v) => instantiate(_v, ctx)),
      );
      return;
    }
  });

  return n;
}

export default instantiate;
