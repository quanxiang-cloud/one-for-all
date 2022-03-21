import { BootResult } from 'packages/render-engine/src/boot-up';
import dummyCTX from '../../../boot-up/__tests__/fixtures/dummy-ctx';
import { RefLoader, CTX, SchemaNode } from '../../../types';

export function useLifecycleHook(): void {
  return;
}

type UseRefResultProps = {
  schemaID: string;
  refLoader?: RefLoader;
  orphan?: boolean;
};

export function useRefResult({ schemaID }: UseRefResultProps): BootResult | undefined {
  if (schemaID === 'undefined') {
    return;
  }

  return {
    ctx: dummyCTX,
    rootNode: {
      id: 'dummy',
      type: 'html-element',
      name: 'div',
      props: {
        id: {
          type: 'constant_property',
          value: 'dummy',
        },
        children: {
          type: 'constant_property',
          value: 'this is dummy node',
        },
      },
    },
  };
}

export function useShouldRender(node: SchemaNode, ctx: CTX): boolean {
  return true;
}
