import React from 'react';
import ReactDOM from 'react-dom';
import { createPopper, Instance, Placement, Modifier } from '@popperjs/core';

export type TriggerMethod = 'click' | 'hover' | 'focus' | 'forever';

type Theme = 'light' | 'dark';

type Props = {
  reference: React.RefObject<Element>;
  children: React.ReactNode;
  trigger?: TriggerMethod;
  onVisibilityChange?: (visible: boolean) => void;
  enableArrow?: boolean;
  placement?: Placement;
  modifiers?: Array<Partial<Modifier<any, any>>>;
  theme?: Theme;
  className?: string;
}

const arrowModifier = {
  name: 'arrow',
  options: {
    element: '[data-popper-arrow]',
  },
};

type State = {
  popVisible: boolean;
}

export default class Popper2 extends React.Component<Props, State> {
  popperContainer: HTMLElement = document.createElement('div');
  instance: Instance | null = null;
  delayTimer: number | null = null;
  trigger: TriggerMethod;

  constructor(props: Props) {
    super(props);

    const { trigger = 'click', theme = 'light', className } = props;
    const classNameList = ['popper-container', `popper-container--${theme}`];
    className && classNameList.push(className);

    this.trigger = trigger;
    this.popperContainer.classList.add(...classNameList);

    if (props.enableArrow) {
      const arrowEle = document.createElement('div');
      arrowEle.setAttribute('data-popper-arrow', '');
      this.popperContainer.append(arrowEle);
    }

    this.state = {
      popVisible: this.trigger === 'forever',
    };
  }

  componentDidMount(): void {
    this.appendContainer();
    this.bindEventsOnReference();
    this.createPopperInstance();
  }

  componentDidUpdate(prevProps: Props, prevState: State): void {
    const { popVisible } = this.state;
    const { popVisible: prevPopVisible } = prevState;

    if (popVisible) {
      this.bindEventsOnPopper();
    } else {
      this.unbindEventsOnPopper();
    }

    if (popVisible !== prevPopVisible) {
      this.props.onVisibilityChange?.(popVisible);
    }

    this.createPopperInstance();
  }

  componentWillUnmount(): void {
    this.cleanUp();
    this.popperContainer.remove();
  }

  createPopperInstance = (): void => {
    if (!this.props.reference.current || !this.state.popVisible) {
      return;
    }

    this.instance = createPopper(this.props.reference.current, this.popperContainer, {
      placement: this.props.placement || 'bottom',
      modifiers: (this.props.modifiers || []).concat(arrowModifier),
    });
  }

  bindEventsOnReference(): void {
    if (!this.props.reference.current || this.trigger === 'forever') {
      return;
    }

    const referenceEle = this.props.reference.current;
    if (this.trigger === 'hover') {
      referenceEle.addEventListener('mouseenter', this.onMouseEnter);
      referenceEle.addEventListener('mouseleave', this.onMouseLeave);
    }

    if (this.trigger === 'focus') {
      referenceEle.addEventListener('focus', this.onTargetFocused);
      referenceEle.addEventListener('blur', this.onTargetBlur);
    } else {
      referenceEle.addEventListener('click', this.onTargetClick);
    }
  }

  bindEventsOnPopper(): void {
    if (this.trigger === 'hover' && this.popperContainer) {
      this.popperContainer.addEventListener('mouseenter', this.onPopupMouseEnter);
      this.popperContainer.addEventListener('mouseleave', this.onPopupMouseLeave);
    }

    if (this.trigger !== 'forever') {
      document.documentElement.addEventListener('click', this.onDocumentClick);
    }
  }

  unbindEventsOnPopper(): void {
    if (this.trigger === 'hover' && this.popperContainer) {
      this.popperContainer.removeEventListener('mouseenter', this.onPopupMouseEnter);
      this.popperContainer.removeEventListener('mouseleave', this.onPopupMouseLeave);
    }

    document.documentElement.removeEventListener('click', this.onDocumentClick);
  }

  onTargetFocused = (): void => {
    this.setPopVisible(true);
  }

  onTargetBlur = (): void => {
    this.delaySetPopVisible(false, 0.15);
  }

  onTargetClick = (): void => {
    this.setPopVisible(!this.state.popVisible);
  }

  appendContainer(): void {
    document.body.appendChild(this.popperContainer);
  }

  onPopupMouseEnter = (): void => {
    this.clearDelayTimer();
  }

  onPopupMouseLeave = (): void => {
    this.delaySetPopVisible(false, 0.1);
  }

  onMouseLeave = (): void => {
    this.delaySetPopVisible(false, 0.1);
  }

  onMouseEnter = (): void => {
    // popper should be showed immediately
    this.delaySetPopVisible(true, 0);
  }

  // close popper when click outside of target or popper content
  onDocumentClick = (e: MouseEvent): boolean => {
    if (!this.props.reference.current ||
      this.popperContainer.contains(e.target as Node) ||
      this.props.reference.current.contains(e.target as Node) ||
      this.props.reference.current === e.target) {
      return true;
    }

    this.close();

    return true;
  }

  handleClosePopper = (): void => {
    this.close();
  }

  close = (): void => {
    this.setPopVisible(false);
  }

  setPopVisible = (popVisible: boolean): void => {
    this.setState({ popVisible });
  }

  get visible(): boolean {
    return this.state.popVisible;
  }

  delaySetPopVisible(visible: boolean, delaySeconds: number): void {
    const delay = delaySeconds * 1000;
    this.clearDelayTimer();
    this.delayTimer = window.setTimeout(() => {
      this.setPopVisible(visible);
      this.clearDelayTimer();
    }, delay);
  }

  clearDelayTimer(): void {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
  }

  cleanUp(): void {
    this.instance?.destroy();
  }

  render(): React.ReactPortal | null {
    if (!this.props.reference.current || !this.state.popVisible) {
      this.cleanUp();
      return null;
    }

    return ReactDOM.createPortal(
      this.props.children,
      this.popperContainer,
    );
  }
}
