import postcss from 'postcss';

import { AST, FormingRule } from './types';
import { getSelectorPath, isSelectorInWhiteList } from './utils';
import { plugins, processOptions } from './constant';

async function toAST(scssStr: string, formingRules: FormingRule[]): Promise<AST> {
  const result = await postcss(plugins).process(scssStr, processOptions);
  if (!result.root) {
    throw new Error('parser scss result no root');
  }

  const root = result.root;

  root.walkRules((rule) => {
    const path = getSelectorPath(rule);
    if (!isSelectorInWhiteList(path, formingRules)) {
      rule.remove();
    }
  });

  const ast = root.toJSON();

  // @ts-ignore
  ast.inputs[0].css = '';

  return ast;
}

export default toAST;
