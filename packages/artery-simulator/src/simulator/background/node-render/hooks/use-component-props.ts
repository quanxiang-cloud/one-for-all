import { CTX, ReactComponentNode, useInstantiateProps } from '@one-for-all/artery-renderer';

import useComponentWrapperRef from './use-component-wrapper-ref';
import { useArteryRootNodeID } from '../../../utils';

function useComponentNodeProps(
  node: ReactComponentNode,
  ctx: CTX,
  depth: number,
): { nodeProps: Record<string, unknown>; wrapperProps: Record<string, unknown> } {
  const nodeProps = useInstantiateProps(node, ctx);
  // use legacy state ref instead of RefObj
  // in order to let useFirstElementChild return the right value
  const setWrapperElement = useComponentWrapperRef(node, depth);
  const rootNodeID = useArteryRootNodeID();

  return {
    nodeProps,
    wrapperProps: {
      style: { display: 'contents' },
      ref: setWrapperElement,
      'data-simulator-background-root-node-rect': rootNodeID === node.id ? true : undefined,
    },
  };
}

export default useComponentNodeProps;
