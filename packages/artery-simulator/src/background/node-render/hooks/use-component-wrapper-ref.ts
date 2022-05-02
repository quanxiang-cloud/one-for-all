import { useState, useRef, useEffect } from 'react';
import { ReactComponentNode } from '@one-for-all/artery-renderer';
import { register, unregister } from './use-element-registration';
import useFirstElementChild from './use-first-element-child';
import { getNodeExecutor } from '../../..//utils';

export default function useComponentWrapperRef(
  node: ReactComponentNode,
  depth: number,
): (ref: HTMLElement) => void {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement>();
  const childElement = useFirstElementChild(wrapperElement);
  const latestChildElementRef = useRef<HTMLElement>();

  useEffect(() => {
    if (latestChildElementRef.current) {
      unregister(latestChildElementRef.current);
    }

    if (!childElement) {
      return;
    }

    childElement.dataset.simulatorNodeId = node.id;
    childElement.dataset.simulatorNodeExecutor = getNodeExecutor(node);
    childElement.dataset.simulatorNodeDepth = `${depth}`;
    register(childElement);

    latestChildElementRef.current = childElement;

    return () => {
      if (childElement) {
        unregister(childElement);
      }
    };
  }, [childElement]);

  return setWrapperElement;
}
