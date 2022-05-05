import { logger } from '@one-for-all/utils';
import React, { PropsWithChildren, ReactNode } from 'react';

type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<PropsWithChildren<any>, State> {
  static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  constructor(props: PropsWithChildren<any>) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: any, errorInfo: any): void {
    logger.error('failed to render component:', error);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <span className="text-grey-400"></span>;
    }

    return this.props.children;
  }
}
