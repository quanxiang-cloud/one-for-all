import { fromJSON, Root, Rule } from 'postcss';
import toFormattedSCSS from './utils/to-formatted-scss';

import { AST, FormingRule } from './types';
import formRoot from './utils/form-root';
import getSelectorsWhitelist from './utils/get-selectors-whitelist';
import removeInvalidRules from './utils/remove-invalid-rules';

function toLeafSelectors(selectors: string[]): string[] {
  const leafs: string[] = [];
  const length = selectors.length;
  const sorted = selectors.sort();
  sorted.forEach((selectorPath, index) => {
    if (index === length - 1) {
      leafs.push(selectorPath);
    }

    if (!sorted[index].startsWith(selectorPath)) {
      leafs.push(selectorPath);
    }
  });

  return leafs;
}

function createMissingRules(missingSelectors: string[]): Array<Rule> {
  const leafs = toLeafSelectors(missingSelectors);
  const missingRules: Array<Rule> = [];
  leafs.forEach((leafPath) => {
    const selectors = leafPath.split('/').reverse();
    let rule: Rule | undefined = undefined;

    selectors.forEach((selector) => {
      if (!rule) {
        rule = new Rule({ selector });
        return;
      }

      rule = new Rule({ selector }).append(rule);
    });

    if (rule) {
      missingRules.push(rule);
    }
  });

  return missingRules;
}

async function formingAST(input: AST, formingRules: FormingRule[]): Promise<string> {
  const root = await formRoot(fromJSON(input) as Root);

  const selectorsWhiteList = getSelectorsWhitelist(formingRules, new Set<string>(), '');
  const missingSelectors = removeInvalidRules(root as Root, selectorsWhiteList);
  const missingRules = createMissingRules(missingSelectors);
  root.append(missingRules);

  const formedRoot = await formRoot(root);
  const scss = await toFormattedSCSS(formedRoot);

  return scss;
}

export default formingAST;
