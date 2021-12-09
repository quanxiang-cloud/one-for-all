import React from 'react';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function Text(props: Props) {
  return (
    <div>
      文本
    </div>
  );
}

export default Text;
