import React from 'react';

import type { CTX, DynamicComponent, ReactComponentNode } from '../../../types';
import { findComponentInRepository } from '../helper';

const nullComponent: React.FC = (): null => null;

export default function useNodeComponent(
  node: Pick<ReactComponentNode, 'packageName' | 'packageVersion' | 'exportName'>,
  { repository, componentLoader }: Pick<CTX, 'repository' | 'componentLoader'>,
): DynamicComponent | undefined {
  if (node.packageName === 'somePackageInRepository') {
    return findComponentInRepository(repository || {}, node);
  }

  return nullComponent;
}
