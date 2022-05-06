import { useEffect } from 'react';

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
