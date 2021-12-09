import page from './page';
import registry from './registry';
import designer from './designer';
import dataSource from './data-source';

const stores: Record<string, any> = {
  page,
  registry,
  designer,
  dataSource,
};

export default stores;
