import React, { useEffect } from 'react';

export default (): JSX.Element => {
  useEffect(() => {
    // import('entryURL:./simulator')
    const asset = new URL('./simulator', import.meta.url);
  }, []);

  return (
    <div>hell world</div>
  );
};
