import page from './page';
import registry from './registry';
import designer from './designer';
import dataSource from './data-source';
import eventBus from './event-bus';

import { CtxValue } from '../ctx';

const stores: CtxValue = {
  page,
  registry,
  designer,
  dataSource,
  eventBus
};

export default stores;
