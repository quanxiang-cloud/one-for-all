import { useEffect, useRef } from 'react';

interface UesHandleEscParma {
  isOpen: boolean;
  onClose?: () => void;
  callOnCloseWhenEscDown?: boolean;
}

export function uesHandleEsc({ isOpen, callOnCloseWhenEscDown, onClose }: UesHandleEscParma): void {
  useEffect(() => {
    if (!isOpen || !callOnCloseWhenEscDown) {
      return;
    }

    function onEscDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !e.isComposing) {
        onClose?.();
      }
    }

    document.addEventListener('keydown', onEscDown);

    return () => document.removeEventListener('keydown', onEscDown);
  }, [isOpen, callOnCloseWhenEscDown]);
}

interface UseToggleCallbackParams {
  isOpen: boolean;
  onClose?: () => void;
}

export function useToggleCallback({ isOpen, onClose }: UseToggleCallbackParams): void {
  useEffect(() => {
    if (!isOpen) {
      onClose?.();
    }
  }, [isOpen]);
}

export function usePreventBodyScroll(isOpen: boolean): void {
  const originalOverflowRef = useRef<string>(document.body.style.overflow)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = originalOverflowRef.current;
    }

    return () => { document.body.style.overflow = originalOverflowRef.current; }
  }, [isOpen])
}
