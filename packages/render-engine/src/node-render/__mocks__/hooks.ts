import dummyCTX from '../../ctx/__tests__/fixtures/dummy-ctx';
import { RefLoader, CTX, SchemaNode } from '../../types';

export function useLifecycleHook(): void {
  return;
}

type RefResult = { refCTX: CTX; refNode: SchemaNode };
type UseRefResultProps = {
  schemaID: string;
  refLoader?: RefLoader;
  orphan?: boolean;
};

export function useRefResult({ schemaID }: UseRefResultProps): RefResult | undefined {
  if (schemaID === 'undefined') {
    return;
  }

  return {
    refCTX: dummyCTX,
    refNode: {
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
