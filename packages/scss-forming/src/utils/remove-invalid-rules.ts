import type { Root } from 'postcss';

import getRulePath from './get-rule-path';

function removeInvalidRules(root: Root, selectorsWhiteList: Set<string>): string[] {
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

export default removeInvalidRules;
