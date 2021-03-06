export type { StyleSheetPlain, RulePlain, CssNodePlain } from 'css-tree';

export type ClassNameSchema = {
  selector: string;
  desc?: string;
  pseudo?: ClassNameSchema[];
  children?: ClassNameSchema[];
}

export type StyleConfigInterface = {
  title: string;
  componentProps?: Record<string, unknown>[] | Record<string, unknown>;
  rules: ClassNameSchema[];
}

export type ComponentSpec = {
  key: string;
  specs: StyleConfigInterface[];
  title: string;
}

export type Colour = {
  name: string,
  colorValues: string[];
}

export type BaseColorConfig = {
  colorNos: number[];
  colors: Colour[];
  primaryColorNo: number;
  primaryColor?: string;
}

export type ThemeVariable = {
  key: string;
  name: string;
}

export type ColorVariables = {
  baseColors: BaseColorConfig;
  theme: ThemeVariable[];
}
