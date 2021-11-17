import { logger } from '@ofa/utils';

import { VersatileFunc } from '../types';

export function convertResult(
  result: Record<string, any>,
  adapters: Record<string, VersatileFunc | undefined>,
  fallbacks: Record<string, any>,
): Record<string, any> {
  return Object.entries(result).reduce<Record<string, any>>((acc, [key, value]) => {
    let v = value ?? fallbacks[key];
    if (typeof adapters[key] === 'function') {
      try {
        v = adapters[key]?.(value) ?? fallbacks[key];
      } catch (error) {
        logger.error('failed to run adapter:\n', adapters[key]?.toString(), '\n', error);
        v = fallbacks[key];
      }
    }

    acc[key] = v;
    return acc;
  }, {});
}
