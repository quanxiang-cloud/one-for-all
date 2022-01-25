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
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  content?: string;
  isAllowSelect?: boolean;
  isAllowSpace?: boolean;
  maxLength?: number;
  'data-node-key': string;
  onClick?: () => void;
}

function Paragraph(props: Props, ref: React.LegacyRef<HTMLDivElement>): JSX.Element {
  const { id, content, isAllowSelect, maxLength, style, onClick, ...rest } = props;

  if (Number(maxLength) > 0) {
    OVERFLOW_STYLE.WebkitLineClamp = maxLength?.toString() || 'none';
  }

  const dataNodeKey = rest['data-node-key'];

  return (
    <p
      data-node-key={dataNodeKey}
      id={id}
      ref={ref}
      className={cs({
        'user-select': isAllowSelect ? 'none' : 'auto',
      })}
      style={{
        ...OVERFLOW_STYLE,
        ...style,
      }}
      onClick={onClick}
    >
      {content}
    </p>
  );
}

export default React.forwardRef(Paragraph);
