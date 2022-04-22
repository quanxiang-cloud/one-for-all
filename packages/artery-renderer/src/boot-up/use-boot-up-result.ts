import { logger } from '@one-for-all/utils';
import type { Artery } from '@one-for-all/artery';
import { useEffect, useState } from 'react';

import { Plugins } from '../types';
import bootUp, { BootResult } from './index';

export default function useBootResult(artery: Artery, plugins?: Plugins): BootResult | undefined {
  const [result, setResult] = useState<BootResult>();

  useEffect(() => {
    let unMounting = false;

    bootUp({ artery, plugins })
      .then((bootResult) => {
        if (!unMounting) {
          setResult(bootResult);
        }
      })
      .catch(logger.error);

    return () => {
      unMounting = true;
    };
  }, [artery]);

  return result;
}
