import React from 'react';
import cs from 'classnames';

export interface Props {
  id?: string;
  linkType: 'outside' | 'inside',
  linkUrl?: string,
  isBlank?: boolean,
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: any;
}

function Link(
  { id, linkType, linkUrl, isBlank, className, style, onClick, children }: Props,
  ref: React.LegacyRef<HTMLAnchorElement>,
): JSX.Element {
  const isOutsideUrl = linkType === 'outside'
  
  return (
    <a
      id={id}
      ref={ref}
      style={style}
      href={linkUrl}
      className={cs('text-blue-600', className)}
      target={isOutsideUrl && isBlank ? '_blank' : '_self'}
      rel='noreferrer'
      onClick={(e) => {
        if (!isOutsideUrl) {
          e.stopPropagation();
          e.preventDefault();
        }

        onClick && onClick(e)
      }}
    >
      {children}
    </a>
  );
}

export default React.forwardRef(Link);
