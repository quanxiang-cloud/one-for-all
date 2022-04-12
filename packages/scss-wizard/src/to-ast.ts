import postcss, { Container, Rule } from 'postcss';
import sorting from 'postcss-plugin-sorting';
import removeComments from 'postcss-discard-comments';
import postcssScss from 'postcss-scss';

import { AST, Selector } from './types';
import { isSelectorInWhiteList } from './utils';

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

const processOption = {
  from: 'index.scss',
  to: 'index.css',
  parser: postcssScss.parse,
  stringifier: postcssScss.stringify,
  map: false,
};

function getSelectorPath(rule: Container): string[] {
  let pointer: Container | undefined = rule;
  const path = [];
  while (pointer) {
    path.push((pointer as Rule).selector);
    if (rule.parent?.type === 'root') {
      break;
    }

    if (pointer !== rule.parent) {
      // @ts-ignore
      pointer = rule.parent;
    } else {
      break;
    }
  }

  return path.reverse();
}

async function toAST(scssStr: string, selectorWhiteList: Selector[]): Promise<AST> {
  const result = await postcss([removeComments, sorting(sortOptions)]).process(scssStr, processOption);
  if (!result.root) {
    throw new Error('parser scss result no root');
  }

  const root = result.root;

  root.walkRules((rule) => {
    const path = getSelectorPath(rule);
    if (!isSelectorInWhiteList(path, selectorWhiteList)) {
      rule.remove();
    }
  });

  const ast = root.toJSON();

  // @ts-ignore
  ast.inputs[0].css = '';

  return ast;
}

export default toAST;
