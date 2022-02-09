import nearley from 'nearley';

import grammar from './grammar';
import { LogicalFormula } from './type';

export default function parse(formula: string): LogicalFormula {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed(formula);

  return parser.results[0];
}
