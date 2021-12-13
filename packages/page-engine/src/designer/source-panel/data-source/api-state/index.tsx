import React from 'react';

import { Search } from '@ofa/ui';

interface Props {
  className?: string;
}

function ApiState(props: Props) {
  return (
    <div>
      <Search />
      <div>
        api state
      </div>
    </div>
  );
}

export default ApiState;
