import React from 'react';

interface Props {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function List(props: Props) {
  return (
    <div>
      列表
    </div>
  );
}

export default List;
