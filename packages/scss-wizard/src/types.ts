import { Root } from 'postcss';
export type AST = Partial<Root>

export interface Selector {
  selector: string;
  desc?: string;
  nestedSelector?: Selector[];
}
