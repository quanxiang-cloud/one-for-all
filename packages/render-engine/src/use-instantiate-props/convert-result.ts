import { logger } from '@ofa/utils';
import { APIResultConvertor } from '../types';

type ConvertResultParams = { result: any; adapter?: APIResultConvertor; fallback: any; };
export default function convertResult({ result, adapter, fallback }: ConvertResultParams): any {
  if (adapter && result !== undefined) {
    try {
      return adapter(result) ?? fallback;
    } catch (error) {
      logger.error('failed to run adapter:\n', adapter.toString(), '\n', error);
      return fallback;
    }
  }

  return result ?? fallback;
}
