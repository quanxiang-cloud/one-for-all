import postcss, { Rule } from 'postcss';
import { fromJS } from 'immutable';

import { processOptions } from './constant';
import { AST, FormingRule } from './types';
import { getSelectorPath, isSelectorInWhiteList } from './utils';

async function formingAST(input: AST, formingRules: FormingRule[]): Promise<AST> {
  const { root } = await postcss([]).process(postcss.fromJSON(input), processOptions);

  let missingSCSSRules = fromJS(formingRules);
  // remove staled scss rules
  root.walkRules((rule) => {

    const path = getSelectorPath(rule);
    if (!isSelectorInWhiteList(path, formingRules)) {
      rule.remove();
    }
  });

  // fill empty new rules
  // find missing rule
  // create rule and append
  // sort by formingRules
  new Rule({ selector: })
  root.walkRules((rule) => {

  })


  const ast = root.toJSON();

  // @ts-ignore
  ast.inputs[0].css = '';

  return ast;
}

export default formingAST;
