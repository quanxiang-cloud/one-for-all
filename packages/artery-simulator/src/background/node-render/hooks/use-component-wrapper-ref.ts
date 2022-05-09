import { useState, useRef, useEffect, useContext } from 'react';
import { ReactComponentNode } from '@one-for-all/artery-renderer';
import { register, unregister } from './use-element-registration';
import useFirstElementChild from './use-first-element-child';
import { getNodeExecutor } from '../../..//utils';
import SimulatorLayerCtx from '../../context';

export default function useComponentWrapperRef(
  node: ReactComponentNode,
  depth: number,
): (ref: HTMLElement) => void {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement>();
  const childElement = useFirstElementChild(wrapperElement);
  const latestChildElementRef = useRef<HTMLElement>();
  const layerCtx = useContext(SimulatorLayerCtx);

  useEffect(() => {
    if (latestChildElementRef.current) {
      unregister(latestChildElementRef.current, layerCtx);
    }

    if (!childElement) {
      return;
    }

    childElement.dataset.simulatorNodeId = node.id;
    childElement.dataset.simulatorNodeExecutor = getNodeExecutor(node);
    childElement.dataset.simulatorNodeDepth = `${depth}`;
    register(childElement, layerCtx);

    latestChildElementRef.current = childElement;

    return () => {
      if (childElement) {
        unregister(childElement, layerCtx);
      }
    };
  }, [childElement]);

  return setWrapperElement;
}
