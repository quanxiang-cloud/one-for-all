import { useState, useEffect, MouseEvent, Dispatch, SetStateAction } from 'react';

import { addEventListener, removeEventListener } from './utils';

export default function usePopperShow(
  onDocumentClick: (event: MouseEvent) => void,
): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [popperShow, setPopperShow] = useState<boolean>(false);

  let removeClickOutside: removeEventListener | null = null;
  let removeTouchOutside: removeEventListener | null = null;

  useEffect(() => {
    if (popperShow) {
      removeClickOutside = addEventListener(
        document,
        'mousedown',
        onDocumentClick,
      );
      removeTouchOutside = addEventListener(
        document,
        'touchstart',
        onDocumentClick,
      );
    } else {
      clearOutsideHandler();
    }
    return () => clearOutsideHandler();
  }, [popperShow]);

  function clearOutsideHandler(): void {
    if (removeClickOutside) {
      removeClickOutside();
      removeClickOutside = null;
    }

    if (removeTouchOutside) {
      removeTouchOutside();
      removeTouchOutside = null;
    }
  }

  return [popperShow, setPopperShow];
}
