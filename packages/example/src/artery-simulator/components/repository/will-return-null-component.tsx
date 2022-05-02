import React, { useState, useEffect } from 'react';

const style: React.CSSProperties = {
  height: '20px',
};

export default function WillReturnNull(): JSX.Element | null {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setDone(true);
    }, 3 * 1000);
  }, []);

  if (!done) {
    return <div style={style}>Render some dom first</div>;
  }

  return null;
}
