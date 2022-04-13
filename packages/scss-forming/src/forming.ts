import { AST, FormingRule } from './types';
import toAST from './to-ast';
import toSCSS from './to-scss';

type Input = string | AST;

async function forming(input: Input, formingRules: FormingRule[]): Promise<{ scss: string; ast: AST; }> {
  if (typeof input === 'string') {
    const ast = await formingSCSS(input, formingRules);
    const scss = await toSCSS(ast);
    return { ast, scss };
  }

  const ast = await formingAST(input, formingRules);
  const scss = await toSCSS(ast);
  return { ast, scss };
}

export default forming;
