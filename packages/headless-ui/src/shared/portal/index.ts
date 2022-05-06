import { useEffect, ReactNode, ReactPortal } from 'react';
import ReactDOM from 'react-dom';

interface Props {
  children: ReactNode;
  mountPoint?: HTMLElement;
}

function useMountPoint(defaultMountPoint?: HTMLElement): HTMLElement {
  const mountPoint = defaultMountPoint || document.createElement('div');
  if (!mountPoint.parentElement) {
    document.body.appendChild(mountPoint);
  }

  useEffect(() => {
    return () => {
      mountPoint.parentElement?.removeChild(mountPoint);
    };
  }, []);

  return mountPoint;
}

// render child outside current dom hierarchy
export function Portal({ children, mountPoint }: Props): ReactPortal {
  const container = useMountPoint(mountPoint);
  return ReactDOM.createPortal(children, container);
}
