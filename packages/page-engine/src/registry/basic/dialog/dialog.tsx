import React from 'react';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function Dialog(props: Props) {
  return (
    <div>
      对话框
    </div>
  );
}

export default Dialog;
