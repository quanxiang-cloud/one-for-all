import { logger } from '@ofa/utils';
import { StateConvertorFunc } from '../types';

type ConvertResultParams = { state: any; convertor?: StateConvertorFunc; fallback: any; };
export default function convertState({ state, convertor, fallback }: ConvertResultParams): any {
  if (convertor && state !== undefined) {
    try {
      return convertor(state) ?? fallback;
    } catch (error) {
      logger.error('failed to run convertor:\n', convertor.toString(), '\n', error);
      return fallback;
    }
  }

  return state ?? fallback;
}
