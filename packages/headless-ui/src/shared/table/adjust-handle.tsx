import React, { useRef, useEffect } from 'react';

type Props = {
  onChange: (a: number) => void;
  onMouseUp: () => void;
  thID: string;
};

export default function AdjustHandle({ onChange, thID, onMouseUp }: Props): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  let x = 0;
  let w = 0;

  const mouseMoveHandler = (e: MouseEvent): void => {
    onChange(w + e.clientX - x);
  };

  const mouseUpHandler = (): void => {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    onMouseUp();
  };

  const onMouseDown = (e: MouseEvent | Event): void => {
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    x = (e as MouseEvent).clientX;
    w = parseInt(document.querySelector(`#${thID}`)?.getAttribute('width') || '0');
  };

  useEffect(() => {
    ref.current?.addEventListener('mousedown', onMouseDown);
  }, []);

  return <div ref={ref} className="ofa-table-adjust-handle" />;
}
