import { Root } from 'postcss';
export type AST = Partial<Root>

export interface Rule {
  selector: string;
  desc?: string;
  subRules?: Rule[];
}
