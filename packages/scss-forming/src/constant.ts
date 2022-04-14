import sorting from 'postcss-plugin-sorting';
import removeComments from 'postcss-discard-comments';
import mergeSelector from 'postcss-combine-duplicated-selectors';
import { parse, stringify } from 'postcss-scss';

export const processOptions = {
  from: 'index.scss',
  to: 'index.css',
  parser: parse,
  stringifier: stringify,
  map: false,
};

const sortOptions = {
  order: [
    'custom-properties',
    'dollar-variables',
    'at-variables',
    {
      type: 'atrule',
      name: 'include',
    },
    'declarations',
    {
      type: 'rule',
      selector: /^&:\w+$/
    },
    'rules',
    'atrule'
  ],
  'properties-order': 'alphabetical',
};

export const plugins = [removeComments, sorting(sortOptions), mergeSelector];
