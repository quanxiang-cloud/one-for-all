import { RenderEngineCTX } from '../types';
import { instantiateFuncSpec, isObject, isFuncSpec } from './utils';

function deserialize(n: unknown, ctx: RenderEngineCTX): void {
  if (!isObject(n) || typeof n !== 'object' || n === null) {
    return;
  }

  Object.entries(n).forEach(([key, v]) => {
    if (isFuncSpec(v)) {
      Reflect.set(n, key, instantiateFuncSpec(v, ctx));
      return;
    }

    if (isObject(v)) {
      deserialize(v, ctx);
      return;
    }

    if (Array.isArray(v)) {
      Reflect.set(n, key, v.map((_v) => {
        deserialize(_v, ctx);
        return _v;
      }));
      return;
    }
  });
}

export default deserialize;
