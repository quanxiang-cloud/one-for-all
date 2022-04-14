import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import { plugins, processOptions } from '../../constant';
import getRulePath from '../get-rule-path';

test('rulePath', async () => {
  const scss = fs.readFileSync(path.join(__dirname, './fixtures/index.scss'), { encoding: 'utf-8' });
  const { root } = postcss(plugins).process(scss, processOptions);

  const ruleSet = new Set<string>();
  root.walkRules((rule) => {
    const path = getRulePath(rule);
    if (path) {
      ruleSet.add(path.join('/'));
    }
  });

  expect(Array.from(ruleSet).sort()).toMatchSnapshot();
});
