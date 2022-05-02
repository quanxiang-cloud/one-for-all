import type { Repository } from '@one-for-all/artery-renderer';

import Normal from './normal-component';
import ReturnDomList from './return-dom-list-component';
import ReturnNull from './return-null-component';
import WillReturnDom from './will-return-dom-component';
import WillReturnNull from './will-return-null-component';
import willReturnDifferentDom from './will-return-different-dom';
import Card from './card';

const repository: Repository = {
  'SimulatorDedicated@whatever': {
    Normal,
    ReturnDomList,
    ReturnNull,
    WillReturnDom,
    WillReturnNull,
    willReturnDifferentDom,
    Card,
  },
};

export default repository;
