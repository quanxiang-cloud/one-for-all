import React from 'react';
import cs from 'classnames';

export interface Props {
  content: React.ReactNode;
  linkType: 'outside' | 'inside',
  id?: string;
  linkUrl?: string,
  isBlank?: boolean,
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  'data-node-key'?: string;
}

function Link(
  { id, linkType, linkUrl, isBlank, className, style, onClick, content, ...rest }: Props,
  ref: React.LegacyRef<HTMLAnchorElement>,
): JSX.Element {
  const isOutsideUrl = linkType === 'outside';
  const dataNodeKey = rest['data-node-key'] || '';

  return (
    <a
      ref={ref}
      rel='noreferrer'
      id={dataNodeKey}
      style={style}
      href={linkUrl}
      className={cs('text-blue-600', className)}
      target={isOutsideUrl && isBlank ? '_blank' : '_self'}
      onClick={(e) => {
        if (!isOutsideUrl) {
          e.stopPropagation();
          e.preventDefault();
        }

        onClick && onClick(e);
      }}
    >
      {content}
    </a>
  );
}

export default React.forwardRef(Link);
