import { logger } from '@ofa/utils';
import { StateConvertorFunc } from '../types';

type ConvertResultParams = { state: any; convertor?: StateConvertorFunc; fallback: any; };
export default function convertState({ state, convertor, fallback }: ConvertResultParams): any {
  if (convertor && state !== undefined) {
    try {
      return convertor(state) ?? fallback;
    } catch (error) {
      logger.error(
        'an error occured while calling state convertor:\n',
        convertor.toString(),
        '\n',
        'So return fallback instead, fallback:', fallback,
        '\n',
        '\n',
        error,
      );
      return fallback;
    }
  }

  return state ?? fallback;
}
