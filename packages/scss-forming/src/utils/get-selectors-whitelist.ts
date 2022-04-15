import { FormingRule } from '../types';

function getSelectorsWhitelist(formingRules: FormingRule[], pathSet:  Set<string>, prefix: string): Set<string> {
  formingRules.forEach(({ selector, nested }) => {
    const current = prefix ? `${prefix}/${selector}` : selector;
    pathSet.add(current);

    if (nested) {
      getSelectorsWhitelist(nested, pathSet, current);
    }
  });

  return pathSet;
}

export default getSelectorsWhitelist;
