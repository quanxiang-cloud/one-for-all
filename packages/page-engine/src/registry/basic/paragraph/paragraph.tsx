import React from 'react';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function Paragraph(props: Props) {
  return (
    <div>
      段落
    </div>
  );
}

export default Paragraph;
