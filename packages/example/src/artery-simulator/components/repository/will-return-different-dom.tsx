import React, { useState, useEffect } from 'react';

const style: React.CSSProperties = {
  height: '20px',
};

const pStyle: React.CSSProperties = {
  height: '40px',
};

export default function WillReturnDom(): JSX.Element | null {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setDone(true);
    }, 3 * 1000);
  }, []);

  if (done) {
    return <p style={pStyle}>this is a p element, and rendered later</p>;
  }

  return <div style={style}>Render div first</div>;
}
