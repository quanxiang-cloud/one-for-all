import React, { useState, useEffect } from 'react';

const style: React.CSSProperties = {
  height: '20px',
};

export default function WillReturnDom(): JSX.Element | null {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setDone(true);
    }, 3 * 1000);
  }, []);

  if (!done) {
    return null;
  }

  return <div style={style}>Render some dom later</div>;
}
