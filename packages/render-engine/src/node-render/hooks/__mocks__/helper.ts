import React, { FC } from 'react';

import { DynamicComponent } from '../../../types';

const dummyComponent = (): JSX.Element => React.createElement('div');
const nullComponent: FC = (): null => null;

import type { ComponentLoaderParam, Repository } from '../../../types';

export function findComponentInRepository(
  repository: Repository,
  { packageName, packageVersion, exportName }: ComponentLoaderParam,
): DynamicComponent | undefined {
  if (packageName === 'null') {
    return;
  }

  return dummyComponent;
}

export function systemComponentLoader({
  packageName,
  exportName,
}: ComponentLoaderParam): Promise<DynamicComponent> {
  if (packageName === 'null') {
    return Promise.resolve(nullComponent);
  }

  return Promise.resolve(dummyComponent);
}
