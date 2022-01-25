import React from 'react';
import cs from 'classnames';

import { IframeConfigProps } from './config-form';

interface Props extends IframeConfigProps {
  style?: React.CSSProperties;
  className?: string;
  'data-node-key'?: string;
}

function Iframe({
  id,
  className,
  iframeName,
  iframeAddr,
  iframeHeight,
  iframeWidth,
  allowFullscreen,
  sandbox,
  referrerPolicy,
  iframeAllow,
  style,
  ...rest
}: Props, ref: React.LegacyRef<HTMLIFrameElement>): JSX.Element {
  const dataNodeKey = rest['data-node-key'] || '';

  if (!iframeAddr) {
    return (
      <div
        data-node-key={dataNodeKey}
        id={id}
        ref={ref}
        style={style}
        className="bg-gray-200 h-200 flex justify-center items-center text-20"
      >
        iframe 占位
      </div>
    );
  }

  return (
    <iframe
      data-node-key={dataNodeKey}
      id={id}
      style={style}
      ref={ref}
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

export default React.forwardRef(Iframe);
