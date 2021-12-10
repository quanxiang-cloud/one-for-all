import page from './page';
import registry from './registry';
import designer from './designer';
import dataSource from './data-source';

import { CtxValue } from '../ctx';

const stores: CtxValue = {
  page,
  registry,
  designer,
  dataSource,
};

export default stores;
