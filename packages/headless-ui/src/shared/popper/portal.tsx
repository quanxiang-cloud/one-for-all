import React, { useRef, useEffect, ReactPortal } from 'react';
import ReactDOM from 'react-dom';

export interface PortalProps {
  getContainer: () => HTMLElement;
  children?: React.ReactNode;
}

function Portal({ getContainer, children }: PortalProps): ReactPortal | null {
  const containerRef = useRef<HTMLElement>();

  const initRef = useRef(false);
  if (!initRef.current) {
    containerRef.current = getContainer();
    initRef.current = true;
  }

  useEffect(() => {
    return () => {
      containerRef.current?.parentNode?.removeChild(containerRef.current);
    };
  }, []);

  if (containerRef.current) {
    return ReactDOM.createPortal(children, containerRef.current);
  }

  return null;
}

export default Portal;
