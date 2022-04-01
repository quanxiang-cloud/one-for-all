import React from 'react';
import cs from 'classnames';

export interface Props extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  content: React.ReactNode;
  linkType: 'outside' | 'inside',
  linkUrl?: string,
  isBlank?: boolean,
}

function Link(
  { linkType, linkUrl, isBlank, onClick, content, className, ...rest }: Props,
  ref: React.LegacyRef<HTMLAnchorElement>,
): JSX.Element {
  const isOutsideUrl = linkType === 'outside';

  return (
    <a
      {...rest}
      ref={ref}
      rel='noreferrer'
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
