import { useState, useRef, useEffect } from 'react';
import { ReactComponentNode } from '@one-for-all/artery-renderer';
import useElementRegistration from './use-element-registration';
import useFirstElementChild from './use-first-element-child';

export default function useComponentWrapperRef(node: ReactComponentNode): (ref: HTMLElement) => void {
  const [wrapperElement, setWrapperElement] = useState<HTMLElement>();
  const childElement = useFirstElementChild(wrapperElement);
  const latestChildElementRef = useRef<HTMLElement>();
  const { register, unregister } = useElementRegistration();

  useEffect(() => {
    if (latestChildElementRef.current) {
      unregister(latestChildElementRef.current);
    }

    if (!childElement) {
      return;
    }

    childElement.dataset.simulatorNodeId = node.id;
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
