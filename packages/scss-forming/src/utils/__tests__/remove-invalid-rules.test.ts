import fs from 'fs';
import path from 'path';
import postcss, { Root } from 'postcss';
import { plugins, processOptions } from '../../constant';
import { FormingRule } from '../../types';
import createRules from '../create-rules';
import formRoot from '../form-root';
import getSelectorsWhitelist from '../get-selectors-whitelist';
import removeInvalidRules from '../remove-invalid-rules';
import toFormattedSCSS from '../to-formatted-scss';

test('removeInvalidRules', async () => {
  const scss = fs.readFileSync(path.join(__dirname, '../../__tests__/fixtures/index.scss'), { encoding: 'utf-8' });
  const { root } = postcss(plugins).process(scss, processOptions);

  const formingRules: FormingRule[] = [
    {
      selector: '.parent',
      nested: [
        { selector: '.children' },
        { selector: '.missing-selector' }
      ]
    }
  ];

  const selectorsWhiteList = getSelectorsWhitelist(formingRules, new Set<string>(), '');
  const missingSelectors = removeInvalidRules(root as Root, selectorsWhiteList);
  console.log(missingSelectors);

  console.log(root.toString());
  const rules = createRules(missingSelectors);
  console.log(rules[0].toString());
  root.append(rules);
  console.log(root.toString());

  const formedRoot = await formRoot(root);
  console.log(formedRoot.toString());

  const formattedSCSS = await toFormattedSCSS(formedRoot);
  console.log(formattedSCSS);
});
