import type { Repository } from '@one-for-all/artery-renderer';

import Card from './card';
import Modal from './modal-component';
import Normal from './normal-component';
import ReturnDomList from './return-dom-list-component';
import ReturnNull from './return-null-component';
import willReturnDifferentDom from './will-return-different-dom';
import WillReturnDom from './will-return-dom-component';
import WillReturnNull from './will-return-null-component';
import WillThrow from './will-throw';

const repository: Repository = {
  'SimulatorDedicated@whatever': {
    Card,
    Modal,
    Normal,
    ReturnDomList,
    ReturnNull,
    willReturnDifferentDom,
    WillReturnDom,
    WillReturnNull,
    WillThrow,
  },
};

export default repository;
