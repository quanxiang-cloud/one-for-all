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
  onClick?: (e: any) => void;
  'data-node-key'?: string;
}

function Link(
  { id, content, linkType, linkUrl, linkPage, isBlank, className, style, onClick, ...rest }: Props,
  ref: React.LegacyRef<HTMLAnchorElement>,
): JSX.Element {
  const dataNodeKey = rest['data-node-key'] || '';

  return (
    <a
      data-node-key={dataNodeKey}
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
    </a>
  );
}

export default React.forwardRef(Link);
