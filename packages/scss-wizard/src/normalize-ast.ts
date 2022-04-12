import postcss from 'postcss';
import { AST, Rule } from './types';

// filter off unwanted rule
// fill missing rule
function normalizeAST(input: AST, standard: Rule[]): AST {
  const root = postcss.fromJSON(input);
  if (root.type === 'root') {
    root.walk
  }
  return input;
}

export default normalizeAST;
