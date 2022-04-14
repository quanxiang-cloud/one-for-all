import { fromJSON, Root } from 'postcss';
import toFormattedSCSS from './utils/to-formatted-scss';

import { AST, FormingRule } from './types';
import formRoot from './utils/form-root';
import getSelectorsWhitelist from './utils/get-selectors-whitelist';
import removeInvalidRules from './utils/remove-invalid-rules';
import createRules from './utils/create-rules';
import removeUnexpectedDecls from './utils/remove-unexpected-declarations';

async function formingAST(input: AST, formingRules: FormingRule[]): Promise<string> {
  const root = await formRoot(fromJSON(input) as Root);

  const selectorsWhiteList = getSelectorsWhitelist(formingRules, new Set<string>(), '');
  const missingSelectors = removeInvalidRules(root as Root, selectorsWhiteList);
  const missingRules = createRules(missingSelectors);

  root.append(missingRules);

  removeUnexpectedDecls(root);

  const formedRoot = await formRoot(root);
  const scss = await toFormattedSCSS(formedRoot);

  return scss;
}

export default formingAST;
