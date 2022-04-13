import postcss, { Result, Root, Rule } from 'postcss';

import { plugins, processOptions } from './constant';
import { AST, FormingRule } from './types';
import getRulePath from './utils/get-rule-path';
import getSelectorsWhitelist from './utils/get-selectors-whitelist';

// return missing selectors
function removeInvalidRule(root: Root, selectorsWhiteList: Set<string>): string[] {
  root.walkRules((rule) => {
    const path = (getRulePath(rule) || []).join('/');
    if (!path) {
      return;
    }

    if (selectorsWhiteList.has(path)) {
      selectorsWhiteList.delete(path);
      return;
    }

    rule.remove();
  });

  return Array.from(selectorsWhiteList);
}

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

async function formingAST(input: AST, formingRules: FormingRule[]): Promise<Result> {
  const { root } = await postcss(plugins).process(postcss.fromJSON(input), processOptions);

  const selectorsWhiteList = getSelectorsWhitelist(formingRules, new Set<string>(), '');
  const missingSelectors = removeInvalidRule(root as Root, selectorsWhiteList);
  const leafs = toLeafSelectors(missingSelectors);
  // remove staled scss rules

  // create missing rules
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
      root.append(rule);
    }
  });

  const formed = await postcss(plugins).process(root, processOptions);

  return formed;
}

export default formingAST;
