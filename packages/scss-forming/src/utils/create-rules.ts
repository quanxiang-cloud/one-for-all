import { Rule } from 'postcss';

function toLeafSelectors(selectors: string[]): string[] {
  const leafs: string[] = [];
  const length = selectors.length;
  const sorted = selectors.sort();

  sorted.forEach((selectorPath, index) => {
    if (index === length - 1) {
      leafs.push(selectorPath);
      return;
    }

    if (!sorted[index + 1].startsWith(selectorPath)) {
      leafs.push(selectorPath);
    }
  });

  return leafs;
}

function createRules(selectorsPath: string[]): Array<Rule> {
  const leafs = toLeafSelectors(selectorsPath);
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

export default createRules;
