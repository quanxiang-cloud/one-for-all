import React from 'react';
import cs from 'classnames';

export interface Props {
  content: string,
  linkType: 'outside' | 'inside',
  linkUrl?: string,
  linkPage?: string,
  isBlank?: boolean,
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function Link(
  { content, linkType, linkUrl, linkPage, isBlank, className, ...rest }: Props,
  ref: React.LegacyRef<HTMLAnchorElement>,
): JSX.Element {
  return (
    <a
      {...rest}
      ref={ref}
      href={linkType === 'outside' ? linkUrl : linkPage}
      className={cs('text-blue-600', className)}
      target={isBlank ? '_blank' : '_self'}
      rel='noreferrer'
    >
      {content || '链接'}
    </a>
  );
}

export default Link;
