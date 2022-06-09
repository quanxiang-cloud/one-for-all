import { defaultDropAnimation, DropAnimation, MeasuringStrategy, Modifier } from '@dnd-kit/core';
import { AnimateLayoutChanges } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const INDENTATION_WIDTH = 25;

export const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ];
  },
  easing: 'ease-out',
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    });
  },
};

export const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y,
    x: transform.x + 20,
  };
};

export const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, wasDragging }) =>
  isSorting || wasDragging ? false : true;

export const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

export const mouseSensorOptions = {
  activationConstraint: {
    delay: 100,
    tolerance: 5,
  },
};
