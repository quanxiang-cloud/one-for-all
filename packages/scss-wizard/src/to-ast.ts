import postcss from 'postcss';
import sorting from 'postcss-plugin-sorting';
import removeComments from 'postcss-discard-comments';
import postcssScss from 'postcss-scss';

import format from './format';
import { AST } from './types';

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

export default function toAST(scssStr: string): Promise<AST> {
  return format(scssStr).then((str) => {
    return postcss([removeComments, sorting(sortOptions)]).process(
      scssStr,
      {
        from: 'index.scss',
        to: 'index.css',
        parser: postcssScss.parse,
        stringifier: postcssScss.stringify,
        map: false,
      }
    );
  }).then((result) => {
    const ast = result.root.toJSON();
    // @ts-ignore
    ast.inputs[0].css = '';
    return ast;
  });
}
