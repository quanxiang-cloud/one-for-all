import formingAST from './forming-ast';
import formRoot from './utils/form-root';
import { FormingRule } from './types';

async function formingSCSS(input: string, formingRules: FormingRule[]): Promise<string> {
  const root = await formRoot(input);
  const scss = await formingAST(root, formingRules);

  return scss;
}

export default formingSCSS;
