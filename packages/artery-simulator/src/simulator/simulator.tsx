import React from 'react';

import Background from './background';
import Foreground from './foreground';
import GreenZone from './green-zone';

import './index.scss';

function Simulator(): JSX.Element {

  return (
    <>
      <Background />
      <GreenZone />
      <Foreground />
    </>
  );
}

export default Simulator;
