import { logger } from '@ofa/utils';
import { StateConvertorFunc } from '../types';

type ConvertResultParams = {
  state: any;
  convertor?: StateConvertorFunc;
  fallback: any;
  propName: string;
};

export default function convertState({ state, convertor, fallback, propName }: ConvertResultParams): any {
  if (convertor && state !== undefined) {
    try {
      return convertor(state) ?? fallback;
    } catch (error) {
      logger.error(
        `an error occurred while calling state convertor for prop: "${propName}"`,
        'with the following state and convertor:',
        '\n',
        state,
        '\n',
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
