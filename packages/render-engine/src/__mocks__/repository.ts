import React from 'react';

import { DynamicComponent } from '../types';

type ImportComponentParams = {
  packageName: string;
  version: string;
  exportName?: string;
}

const dummyComponent = (): JSX.Element => React.createElement('div');

export function importComponent({ packageName }: ImportComponentParams): Promise<DynamicComponent | null> {
  if (packageName === 'null') {
    return Promise.resolve(null);
  }

  return Promise.resolve(dummyComponent);
}
