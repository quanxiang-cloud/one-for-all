import { logger } from '@one-for-all/utils';

import type {
  ComponentLoaderParam,
  DynamicComponent,
  Repository,
} from '../../types';

export function findComponentInRepository(
  repository: Repository,
  { packageName, packageVersion, exportName }: ComponentLoaderParam,
): DynamicComponent | undefined {
  const packageNameVersion = `${packageName}@${packageVersion}`;

  return repository[packageNameVersion]?.[exportName || 'default'];
}

export function systemComponentLoader({ packageName, exportName }: ComponentLoaderParam): Promise<DynamicComponent> {
  return System.import(packageName)
    .then((systemModule) => {
      // todo catch undefined error
      return systemModule[exportName || 'default'];
    })
    .catch((error) => {
      logger.error('failed to load node component,', error);

      return null;
    });
}
