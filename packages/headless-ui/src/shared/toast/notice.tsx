import React, { useEffect, useState } from 'react';
import cs from 'classnames';

// import Icon from '@one-for-all/icon';
import { Notice } from './notification';


export interface Props {
  notice: Notice;
  onClose?: (notice: Notice, timeout?: number) => void
}

function Notice({ notice, onClose }: Props): JSX.Element {
  const [isClose, setIsClose] = useState<boolean>(false);
  const { content, modifier, id, icon } = notice;
  useEffect(() => {
    const closeTimer = setTimeout(() => {
      handleClose();
    }, notice.duration || 0);
    return () => {
      clearTimeout(closeTimer);
    };
  }, []);

  function handleClose(): void {
    setIsClose(true);
    notice.onClose?.();
    onClose?.(notice, 300);
  }

  return (
    <div
      id={id}
      className={cs(`ofa-notice ofa-notice__${modifier}`,
        isClose ? 'ofa-notice-out' : 'ofa-notice-in',
      )}>
      <div className={`ofa-notice-icon`} >
        {icon}
      </div>
      <div className={`ofa-notice-content`}>
        {content}
      </div>
      <div
        className={`ofa-notice-close-btn`}
        onClick={handleClose}
      >
        {/* <Icon name="close" size={20} /> */}
      </div>
    </div>
  );
}

export default Notice;
