import React from 'react';
import cs from 'classnames';

import { IframeConfigProps } from './config-form';

interface Props extends IframeConfigProps {
  className?: string;
}

function Iframe({
  className,
  iframeName,
  iframeAddr,
  iframeHeight,
  iframeWidth,
  allowFullscreen,
  sandbox,
  referrerPolicy,
  iframeAllow,
}: Props): JSX.Element {
  if (!iframeAddr) {
    return (
      <div className="bg-gray-200 h-200 flex justify-center items-center text-20">
        iframe 占位
      </div>
    );
  }

  return (
    <iframe
      allow={iframeAllow}
      referrerPolicy={referrerPolicy}
      name={iframeName}
      width={iframeWidth}
      height={iframeHeight}
      className={cs(className)}
      allowFullScreen={allowFullscreen}
      src={iframeAddr}
      sandbox={sandbox}
    >
    </iframe>
  );
}

export default Iframe;
