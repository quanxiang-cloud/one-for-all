import cssbeautify from 'cssbeautify';
import {
  generate,
  SelectorPlain,
  fromPlainObject,
  parse,
  toPlainObject,
  StyleSheetPlain,
  RulePlain,
  CssNodePlain,
  SelectorListPlain
} from 'css-tree';
import init, { compressStringGzip } from "./wasm_gzip/wasm_gzip";
import wasm_gzip_bg from './wasm_gzip/wasm_gzip_bg.wasm';
import type { ClassNameSchema, StyleConfigInterface, BaseColorConfig } from './type';
import './assets/csslint.js';

export * from './type';

function toAST(css: string): StyleSheetPlain {
  return toPlainObject(parse(css)) as StyleSheetPlain;
}

function toCSSString(ast: StyleSheetPlain, isBeautify = false): string {
  const cssString = generate(fromPlainObject(JSON.parse(JSON.stringify(ast))));
  return isBeautify ? cssbeautify(cssString) : cssString;
}

function schemaToInitCss(configSchemas: ClassNameSchema[], prefix?: string): string {
  let _initialValues = '';
  configSchemas.forEach((config) => {
    const _selector = `${prefix ? prefix + ' ' : ''}${config.selector}`;
    config.desc ? _initialValues += `/* ${config.desc} */\n` : '';
    _initialValues += `${_selector} {\n\n} \n`;
    if (config.pseudo) {
      config.pseudo.forEach(({ desc, selector }) => {
        desc ? _initialValues += `/* ${desc} */\n` : '';
        _initialValues += `${config.selector}:${selector} {\n\n} \n`;
      });
    }

    if (config.children) {
      _initialValues += schemaToInitCss(config.children, _selector);
    }
  });

  return _initialValues;
}

function getSelectorsAST(rule: RulePlain) {
  const list = (rule.prelude as SelectorListPlain).children;
  if (list.length) {
    return (list[0] as SelectorPlain).children
  }

  return;
}

function selectorDetection(cssAst: StyleSheetPlain, classNameSchema: ClassNameSchema[]): StyleSheetPlain {
  const initCssAst = toAST(schemaToInitCss(classNameSchema)) as StyleSheetPlain;
  const newRules = initCssAst.children.map((rule) => {
    const targetRule = cssAst.children.find((customRule) => {
      return JSON.stringify(getSelectorsAST(customRule as RulePlain)) === JSON.stringify(getSelectorsAST(rule as RulePlain))
    }) as RulePlain | undefined;

    return {
      ...rule,
      block: targetRule?.block || {
        children: [],
        loc: null,
        type: "Block",
      },
    }
  });

  return { ...initCssAst, children: newRules as CssNodePlain[] };
}

function cssGzip(cssStr: string): Promise<Blob | null> {
  return init(wasm_gzip_bg).then(() => {
    let compressed = compressStringGzip(cssStr);
    if (!compressed) {
      return null;
    }

    return new Blob([compressed], { type: 'application/x-gzip' });
  });
}

function getColorVariablesCss(variables: BaseColorConfig): string {
  const cssVariables = variables.colors.map(({ name, colorValues }) => {
    if (name === variables.primaryColor) {
      let primaryColorCss = '';
      const str = variables.colorNos.map((no, index) => {
        primaryColorCss += `--primary-${no}: ${colorValues[index]};`
        return `--${name}-${no}: ${colorValues[index]};`
      }).join('');

      return str + primaryColorCss;
    }

    return variables.colorNos.map((no, index) => {
      return `--${name}-${no}: ${colorValues[index]};`
    }).join('');
  })

  return `:root{${cssVariables.join('')}}`;
}

type props = {
  initCssMap?: Record<string, StyleSheetPlain>;
  baseColorVariables?: BaseColorConfig;
}

export default class CssASTStore {
  cssASTMap: Record<string, StyleSheetPlain>;
  baseVariables: BaseColorConfig;
  constructor({ initCssMap, baseColorVariables }: props) {
    this.cssASTMap = initCssMap || {};
    this.baseVariables = baseColorVariables || {
      colorNos: [],
      primaryColor: 'blue',
      primaryColorNo: 0,
      colors: [],
    }
  }

  getCssAST(key: string) {
    return this.cssASTMap[key];
  }

  setCss(key: string, css: string, rules: ClassNameSchema[], failBack: (msg: string) => void) {
    const results = (window as any).CSSLint.verify(css);
    if (!results.messages.every(({ type }: any) => type !== 'error')) {
      failBack('css 格式错误');
      return;
    }

    this.cssASTMap[key] = selectorDetection(toAST(css), rules);
  }

  getCssString(isBeautify = false): string {
    const compCss = Object.entries(this.cssASTMap).map(([_, cssAst]) => toCSSString(cssAst, isBeautify)).join('');
    const variablesCss = getColorVariablesCss(this.baseVariables);
    return `${variablesCss} ${compCss}`;
  }

  getComponentCss(componentKey: string, specs: StyleConfigInterface[]) {
    const cssList = specs.map((spec) => {
      const key = `${componentKey}.${spec.title}`;

      return this.cssASTMap[key] ? toCSSString(this.cssASTMap[key]) : '';
    })

    return cssList.join('');
  }

  getInitCompCss(componentKey: string, rules: ClassNameSchema[]): string {
    if (this.cssASTMap[componentKey]) {
      return toCSSString(selectorDetection(this.cssASTMap[componentKey], rules), true);
    }

    return schemaToInitCss(rules);
  }

  getGzipFile(): Promise<Blob | null> {
    return cssGzip(this.getCssString());
  }
}
