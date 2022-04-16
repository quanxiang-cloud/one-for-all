import { useContext } from 'react';
import { AllElementsCTX, VisibleObserverCTX } from '../../contexts';

type Register = (element: HTMLElement) => void;
type Unregister = (element: HTMLElement) => void;

export default function useElementRegistration(): { register: Register; unregister: Unregister } {
  const observer = useContext(VisibleObserverCTX);
  const allElements = useContext(AllElementsCTX);

  return {
    register: (element) => {
      observer.observe(element);
      allElements.set(element, false);
    },
    unregister: (element) => {
      observer.unobserve(element);
      allElements.delete(element);
    },
  };
}
