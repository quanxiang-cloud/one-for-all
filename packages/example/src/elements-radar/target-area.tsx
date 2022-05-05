import React, { useImperativeHandle, useState, useEffect, useRef, Ref } from 'react';

const ids = Array.from(new Array(1000)).map((_, i) => i);

function getCellClassName(index: number): string {
  const classNames: string[] = ['cell'];
  classNames.push(index % 2 ? 'odd' : 'even')
  if ((index + 1) % 5 === 0) {
    classNames.push('tail');
  }

  if ((index + 1) % 5 === 1) {
    classNames.push('head');
  }

  return classNames.join(' ');
}

interface TargetAreaProps {
  onVisibleCellChange: (visibleCell: HTMLElement[]) => void;
  scrollPosition: { x: number; y: number; };
}

function TargetArea({ onVisibleCellChange, scrollPosition }: TargetAreaProps, ref?: Ref<HTMLDivElement | null>): JSX.Element {
  const areaRoot = useRef<HTMLDivElement>(null);
  const visibleCellsRef = useRef<Set<HTMLElement>>(new Set<HTMLElement>());
  useImperativeHandle(ref, () => areaRoot.current);

  useEffect(() => {
    if (!areaRoot.current) {
      return;
    }

    areaRoot.current.scrollLeft = scrollPosition.x;
    areaRoot.current.scrollTop = scrollPosition.y;

  }, [scrollPosition]);

  useEffect(() => {
    if (!areaRoot.current) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (isIntersecting) {
          visibleCellsRef.current.add(target as HTMLElement)
        } else {
          visibleCellsRef.current.delete(target as HTMLElement);
        }
      })

      onVisibleCellChange(Array.from(visibleCellsRef.current.values()));
    }, { root: areaRoot.current });

    Array.from(areaRoot.current.children).forEach((child) => {
      observer.observe(child);
    });
  }, []);

  return (
    <div ref={areaRoot} className="target-area-root">
      {
        ids.map((id) => {
          return (
            <div key={id} data-id={id} className={getCellClassName(id)}>
              <span>{id}</span>
            </div>
          );
        })
      }
    </div>
  )
}

export default React.forwardRef(TargetArea);
