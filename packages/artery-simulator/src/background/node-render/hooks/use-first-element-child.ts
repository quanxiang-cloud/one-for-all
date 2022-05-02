import { useState, useEffect } from 'react';

const observerInit: MutationObserverInit = { childList: true };

function mutationCallback(setChildElement: (child: HTMLElement) => void): MutationCallback {
  return (mutationsList: MutationRecord[]) => {
    for (const { type, target } of mutationsList) {
      if (type !== 'childList') {
        return;
      }

      if (target.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      const firstChild = (target as HTMLElement).firstElementChild;
      if (!firstChild) {
        return;
      }

      setChildElement(firstChild as HTMLElement);
    }
  };
}

export default function useFirstElementChild(parentElement: HTMLElement | undefined): HTMLElement | null {
  const [childElement, setChildElement] = useState<HTMLElement | null>(() => {
    if (parentElement?.firstElementChild) {
      return parentElement?.firstElementChild as HTMLElement;
    }

    return null;
  });

  useEffect(() => {
    if (!parentElement) {
      return;
    }

    if (parentElement.firstElementChild) {
      setChildElement(parentElement.firstElementChild as HTMLElement);
    }

    const observer = new MutationObserver(mutationCallback(setChildElement));
    observer.observe(parentElement, observerInit);

    return () => {
      observer.disconnect();
    };
  }, [parentElement]);

  return childElement;
}
