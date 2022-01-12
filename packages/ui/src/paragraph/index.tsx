import React from 'react';
import cs from 'classnames';

const OVERFLOW_STYLE: React.CSSProperties = {
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 'none',
  // English(Auto wrap)
  wordWrap: 'break-word',
  wordBreak: 'break-all',
};

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  content?: string;
  isAllowSelect?: boolean;
  isAllowSpace?: boolean;
  maxLength?: number;
  'data-node-key': string;
}

function Paragraph(props: Props, ref: React.LegacyRef<HTMLDivElement>): JSX.Element {
  const { content, isAllowSelect, maxLength, style, ...rest } = props;

  if (Number(maxLength) > 0) {
    OVERFLOW_STYLE.WebkitLineClamp = maxLength?.toString() || 'none';
  }

  return (
    <p
      data-node-key={rest['data-node-key']}
      ref={ref}
      className={cs({
        'user-select': isAllowSelect ? 'none' : 'auto',
      })}
      style={{
        ...OVERFLOW_STYLE,
        ...style,
      }}
    >
      {content || '段落文本'}
    </p>
  );
}

export default React.forwardRef(Paragraph);
