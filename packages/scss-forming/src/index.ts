import { AST, FormingRule } from './types';
import formingAST from './forming-ast';
import formingSCSS from './forming-scss';
import toAST from './utils/to-ast';

export * from './types';

async function forming(input: string | AST, formingRules: FormingRule[]): Promise<{ scss: string; ast: AST; }> {
  let scss = '';
  if (typeof input === 'string') {
    scss = await formingSCSS(input, formingRules);
  } else {
    scss = await formingAST(input, formingRules);
  }

  const ast = await toAST(scss);

  return { ast, scss };
}

export default forming;
