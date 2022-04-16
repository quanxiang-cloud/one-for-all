import { CTX, ReactComponentNode, useInstantiateProps } from '@one-for-all/artery-renderer';
import useComponentWrapperRef from './use-component-wrapper-ref';

function useComponentNodeProps(
  node: ReactComponentNode,
  ctx: CTX,
): { nodeProps: Record<string, unknown>; wrapperProps: Record<string, unknown> } {
  const nodeProps = useInstantiateProps(node, ctx);
  // use legacy state ref instead of RefObj
  // in order to let useFirstElementChild return the right value
  const setWrapperElement = useComponentWrapperRef(node);

  return {
    nodeProps,
    wrapperProps: {
      style: { display: 'contents' },
      ref: setWrapperElement,
    },
  };
}

export default useComponentNodeProps;
