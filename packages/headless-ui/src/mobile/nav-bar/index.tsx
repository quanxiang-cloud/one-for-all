import React, { ForwardedRef, isValidElement, ReactElement, useImperativeHandle, useRef } from 'react';
import cs from 'classnames';

import useHeight from '../../hooks/use-height';
import { getZIndexStyle } from '../../utils';
import Icon from '@one-for-all/icon';

import '../../styles_todo_delete_this/components/nav-bar.scss';

function NavBar(props: NavBarProps, ref: ForwardedRef<HTMLDivElement>): JSX.Element {
  const {
    onClickLeft,
    onClickRight,
    left,
    leftArrow,
    right,
    fixed,
    placeholder,
    safeAreaInsetTop = true,
    title,
    zIndex,
  } = props;

  const navBarRef = useRef(null);

  const navBarHeight = useHeight(navBarRef);

  const renderLeft = (): React.ReactNode => {
    if (typeof left !== 'string' && isValidElement(left)) {
      return left;
    }

    return [
      !!leftArrow && (
        <Icon key="ofa-nav-bar__arrow" className="ofa-nav-bar__arrow" name="keyboard_backspace" size={24} />
      ),
      !!left && (
        <span key="ofa-nav-bar__text" className="ofa-nav-bar__text">
          {left}
        </span>
      ),
    ];
  };

  const renderRight = (): React.ReactNode => {
    if (typeof right !== 'string' && isValidElement(right)) {
      return right;
    }

    return <span className="ofa-nav-bar__text">{right}</span>;
  };

  const renderNavBar = (): ReactElement => {
    const style = getZIndexStyle(zIndex, props.style);

    const hasLeft = leftArrow || !!left;
    const hasRight = !!right;

    return (
      <div
        ref={navBarRef}
        style={style}
        className={cs(
          'ofa-nav-bar',
          { 'ofa-nav-bar--fixed': fixed, 'ofa-safe-area-inset-top': safeAreaInsetTop },
          props.className,
        )}
      >
        <div className="ofa-nav-bar__content text-primary">
          {hasLeft && (
            <div className="ofa-nav-bar__left" onClick={onClickLeft}>
              {renderLeft()}
            </div>
          )}
          <div className="ofa-nav-bar__title title3 truncate">{title}</div>
          {hasRight && (
            <div className="ofa-nav-bar__right" onClick={onClickRight}>
              {renderRight()}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPlaceholder = (): React.ReactNode => {
    if (fixed && placeholder) {
      return (
        <div
          className="ofa-nav-bar__placeholder"
          style={{ height: navBarHeight ? `${navBarHeight}px` : undefined }}
        />
      );
    }
    return null;
  };

  useImperativeHandle(ref, () => navBarRef?.current as unknown as HTMLDivElement);

  return (
    <>
      {renderPlaceholder()}
      {renderNavBar()}
    </>
  );
}

export default React.forwardRef(NavBar);
