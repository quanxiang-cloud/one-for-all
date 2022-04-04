import { BootResult } from '../../../boot-up';
import dummyCTX from '../../../boot-up/__tests__/fixtures/dummy-ctx';
import { RefLoader, CTX, ArteryNode } from '../../../types';

export function useLifecycleHook(): void {
  return;
}

type UseRefResultProps = {
  arteryID: string;
  refLoader?: RefLoader;
  orphan?: boolean;
};

export function useRefResult({ arteryID }: UseRefResultProps): BootResult | undefined {
  if (arteryID === 'undefined') {
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

export function useShouldRender(node: ArteryNode, ctx: CTX): boolean {
  return true;
}
