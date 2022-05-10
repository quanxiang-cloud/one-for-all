import React from 'react';
import { RecoilRoot } from 'recoil';

import Simulator, { Props } from './simulator/simulator';

export * from './types';
export * from './simulator/constants';

export default (props: Props): JSX.Element => {
  return (
    <RecoilRoot>
      <Simulator {...props} />
    </RecoilRoot>
  );
};
