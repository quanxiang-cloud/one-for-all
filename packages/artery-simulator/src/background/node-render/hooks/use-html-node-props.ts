import { useRef, useEffect, useContext } from 'react';
import { CTX, HTMLNode } from '@one-for-all/artery-renderer';
import { useInstantiateProps } from '@one-for-all/artery-renderer';

import { register, unregister } from './use-element-registration';
import { ArteryCtx } from '../../../contexts';
import { getNodeExecutor } from '../../../utils';

export default function useHTMLNodeProps(node: HTMLNode, ctx: CTX, depth: number): Record<string, unknown> {
  const props = useInstantiateProps(node, ctx);
  const ref = useRef<HTMLElement>();
  const { rootNodeID } = useContext(ArteryCtx);

  useEffect(() => {
    if (ref.current) {
      register(ref.current);
    }

    return () => {
      if (ref.current) {
        unregister(ref.current);
      }
    };
  }, []);

  // todo support forward ref case
  return {
    ...props,
    ref,
    'data-simulator-node-id': node.id,
    'data-simulator-node-depth': depth,
    'data-simulator-node-executor': getNodeExecutor(node),
    'data-simulator-background-root-node': rootNodeID === node.id ? true : undefined,
  };
}
