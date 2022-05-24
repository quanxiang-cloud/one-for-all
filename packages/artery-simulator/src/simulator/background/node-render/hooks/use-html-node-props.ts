import { useRef, useEffect, useContext, useState } from 'react';
import { CTX, HTMLNode } from '@one-for-all/artery-renderer';
import { useInstantiateProps } from '@one-for-all/artery-renderer';

import { register, unregister } from './use-element-registration';
import { getNodeExecutor, useArteryRootNodeID } from '../../../utils';
import MonitoredElementsContext from '../../context';

export default function useHTMLNodeProps(node: HTMLNode, ctx: CTX, depth: number): Record<string, unknown> {
  const props = useInstantiateProps(node, ctx);
  const [ref, setRef] = useState<HTMLElement>();
  const layerCtx = useContext(MonitoredElementsContext);

  useEffect(() => {
    if (ref) {
      register(ref, layerCtx);
    }

    return () => {
      if (ref) {
        unregister(ref, layerCtx);
      }
    };
  }, [ref]);

  // todo support forward ref case
  return {
    ...props,
    ref: (_ref: HTMLElement) => _ref && setRef(_ref),
    'data-simulator-node-id': node.id,
    'data-simulator-node-depth': depth,
    'data-simulator-node-executor': getNodeExecutor(node),
  };
}
