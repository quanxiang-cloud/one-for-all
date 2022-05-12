import React from 'react';
import { RecoilRoot } from 'recoil';

import Simulator, { Props } from './simulator';

export * from './types';
export * from './constants';

export default (props: Props): JSX.Element => {
  return (
    <RecoilRoot>
      <Simulator {...props} />
    </RecoilRoot>
  );
};
