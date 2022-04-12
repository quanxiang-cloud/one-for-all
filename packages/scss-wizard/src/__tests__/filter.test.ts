jest.mock('../format');
import fs from 'fs';
import path from 'path';
import toAST from '../to-ast';
import toSCSS from '../to-scss';

test('toAST_should_throw_if_encounter_bad_scss', async () => {
  const bemSCSS = fs.readFileSync(path.join(__dirname, 'fixtures/bem.scss'),  { encoding: 'utf-8' });
  const ast = await toAST(bemSCSS);

  const scss = await toSCSS(ast);
  console.log(scss);

  expect(ast.nodes).toMatchSnapshot();
});
