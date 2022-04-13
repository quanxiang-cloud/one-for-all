import { Root } from 'postcss';
export type AST = Partial<Root>

export interface FormingRule {
  selector: string;
  desc?: string;
  nestedSelectors?: FormingRule[];
}

export interface FormingRule {
  selector: string;
  comment?: string;
  nested?: FormingRule[];
}
