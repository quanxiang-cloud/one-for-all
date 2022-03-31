import React from 'react';
import cs from 'classnames';

export interface Props {
  id?: string;
  content: string,
  linkType: 'outside' | 'inside',
  linkUrl?: string,
  linkPage?: string,
  isBlank?: boolean,
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: any;
}

function Link(
  { id, content, linkType, linkUrl, linkPage, isBlank, className, style, onClick, children }: Props,
  ref: React.LegacyRef<HTMLAnchorElement>,
): JSX.Element {
  return (
    <a
      id={id}
      ref={ref}
      style={style}
      href={linkType === 'outside' ? linkUrl : linkPage}
      className={cs('text-blue-600', className)}
      target={isBlank ? '_blank' : '_self'}
      rel='noreferrer'
      onClick={onClick}
    >
      {content}
      {children}
    </a>
  );
}

export default React.forwardRef(Link);
