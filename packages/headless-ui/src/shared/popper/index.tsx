import React, {
  useRef,
  useMemo,
  useEffect,
  useContext,
  ReactElement,
  CSSProperties,
  MouseEvent,
  TouchEvent,
  FocusEvent,
  SyntheticEvent,
  EventHandler,
  TouchEventHandler,
  MouseEventHandler,
  FocusEventHandler,
  RefObject,
} from 'react';
import { createPopper, Placement, Modifier } from '@popperjs/core';

import Portal from './portal';
import PopperContext from './context';
import usePopperShow from './hooks';

export interface PopperProps {
  className?: string;
  style?: CSSProperties;
  children: ReactElement;
  enableArrow?: boolean;
  placement?: Placement;
  modifiers?: Array<Partial<Modifier<any, any>>>;
  container?: Element | null,
  onVisibleChange?: (visible: boolean) => void;
}

type PopperHandler<T extends SyntheticEvent, U extends EventHandler<T>> = (
  handler?: U
) => U;

type UsePopperResult<T extends Element> = {
  referenceRef: RefObject<T>,
  handleClick: PopperHandler<MouseEvent, MouseEventHandler>,
  handleContextMenu: PopperHandler<MouseEvent, MouseEventHandler>,
  handleTouchStart: PopperHandler<TouchEvent, TouchEventHandler>,
  handleTouchEnd: PopperHandler<TouchEvent, TouchEventHandler>,
  handleMouseEnter: PopperHandler<MouseEvent, MouseEventHandler>,
  handleMouseLeave: PopperHandler<MouseEvent, MouseEventHandler>,
  handleFocus: PopperHandler<FocusEvent, FocusEventHandler>,
  handleBlur: PopperHandler<FocusEvent, FocusEventHandler>,
  Popper: (props: PopperProps) => JSX.Element,
  close: () => void
}

const arrowModifier = {
  name: 'arrow',
  options: {
    element: '[data-popper-arrow]',
  },
};

export default function usePopper<T extends Element>(onVisibleChange?: (popperShow: boolean) => void): UsePopperResult<T> {
  const referenceRef = useRef<T>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const context = useContext(PopperContext);
  const [popperShow, setPopperShow] = usePopperShow(onDocumentClick);

  useEffect(() => {
    onVisibleChange?.(popperShow);
  }, [popperShow]);


  let isHoverTrigger = false;
  let hasPopupMouseDown = false;
  let delayTimer: number | null = null;
  let mouseDownTimeout: number | null = null;

  function onDocumentClick(event: MouseEvent): void {
    const { target } = event;
    const root = referenceRef.current;
    const popupNode = popupRef.current;
    if (
      !root?.contains(target as Node) &&
      !popupNode?.contains(target as Node) &&
      !hasPopupMouseDown
    ) {
      close();
    }
  }

  function setPopupVisible(visible: boolean): void {
    clearDelayTimer();
    if (visible !== popperShow) {
      setPopperShow(visible);
    }
  }

  function delaySetPopupVisible(visible: boolean, delay: number): void {
    clearDelayTimer();
    if (delay) {
      delayTimer = window.setTimeout(() => {
        setPopupVisible(visible);
        clearDelayTimer();
      }, delay);
    } else {
      setPopupVisible(visible);
    }
  }

  function close(): void {
    setPopupVisible(false);
  }

  function clearDelayTimer(): void {
    clearTimeout(delayTimer as number);
  }

  function handleClick(handler?: MouseEventHandler): MouseEventHandler {
    return (e: MouseEvent) => {
      setPopupVisible(!popperShow);
      handler && handler(e);
    };
  }

  function handleContextMenu(handler?: MouseEventHandler): MouseEventHandler {
    return (e: MouseEvent) => {
      setPopupVisible(!popperShow);
      handler && handler(e);
    };
  }

  function handleTouchStart(handler?: TouchEventHandler): TouchEventHandler {
    return (e: TouchEvent) => {
      setPopupVisible(!popperShow);
      handler && handler(e);
    };
  }

  function handleTouchEnd(handler?: TouchEventHandler): TouchEventHandler {
    return (e: TouchEvent) => {
      delaySetPopupVisible(false, 150);
      handler && handler(e);
    };
  }

  function handleMouseEnter(handler?: MouseEventHandler): MouseEventHandler {
    isHoverTrigger = true;
    return (e: MouseEvent) => {
      setPopupVisible(true);
      handler && handler(e);
    };
  }

  function handleMouseLeave(handler?: MouseEventHandler): MouseEventHandler {
    return (e: MouseEvent) => {
      delaySetPopupVisible(false, 150);
      handler && handler(e);
    };
  }

  function handleFocus(handler?: FocusEventHandler): FocusEventHandler {
    return (e: FocusEvent) => {
      delaySetPopupVisible(true, 150);
      handler && handler(e);
    };
  }

  function handleBlur(handler?: FocusEventHandler): FocusEventHandler {
    return (e: FocusEvent) => {
      delaySetPopupVisible(false, 150);
      handler && handler(e);
    };
  }

  function onPopupMouseEnter(): void {
    isHoverTrigger && clearDelayTimer();
  }

  function onPopupMouseLeave(): void {
    isHoverTrigger && delaySetPopupVisible(false, 150);
  }

  function onPopupMouseDown(e: any): void {
    hasPopupMouseDown = true;
    clearTimeout(mouseDownTimeout as number);
    mouseDownTimeout = window.setTimeout(() => {
      hasPopupMouseDown = false;
    }, 0);

    if (context && context.onPopupMouseDown) {
      context.onPopupMouseDown(e);
    }
  }

  function Popper({
    className,
    style,
    placement,
    modifiers,
    container,
    enableArrow = false,
    children,
  }: PopperProps): JSX.Element {
    function getContainer(): HTMLDivElement {
      const popupContainer = document.createElement('div');
      popupContainer.classList.add('ofa-popper-container');

      if (enableArrow) {
        const arrowEle = document.createElement('div');
        arrowEle.setAttribute('data-popper-arrow', '');
        popupContainer.append(arrowEle);
      }

      attachParent(popupContainer);
      return popupContainer;
    }

    function attachParent(popupContainer: HTMLDivElement): void {
      const parent = container ? container : document.body;
      parent.appendChild(popupContainer);
      createPopperInstance(popupContainer);
    }

    function createPopperInstance(popupContainer: HTMLDivElement): void {
      referenceRef.current && createPopper(referenceRef.current, popupContainer, {
        placement: placement || 'bottom',
        modifiers: (modifiers || []).concat(arrowModifier),
      });
    }

    return (
      <PopperContext.Provider value={{ onPopupMouseDown: onPopupMouseDown }}>
        {
          popperShow ? (<Portal key="portal" getContainer={getContainer}>
            <div
              ref={popupRef}
              className={className}
              onTouchStartCapture={onPopupMouseDown}
              onMouseDownCapture={onPopupMouseDown}
              onMouseLeave={onPopupMouseLeave}
              onMouseEnter={onPopupMouseEnter}
              style={style}
            >
              {children}
            </div>
          </Portal>) : null
        }
      </PopperContext.Provider>
    );
  }

  return useMemo(() => ({
    referenceRef,
    handleClick,
    handleContextMenu,
    handleTouchStart,
    handleTouchEnd,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
    Popper,
    close,
  }), [popperShow]);
}
