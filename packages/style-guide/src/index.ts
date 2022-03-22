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
import type { ClassNameSchema, StyleConfigInterface } from './type';
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
  return init(`https://ofapkg.pek3b.qingstor.com/@one-for-all/style-guide@0.0.1/wasm_gzip_bg.wasm`).then(() => {
    let compressed = compressStringGzip(cssStr);
    if (!compressed) {
      return null;
    }

    return new Blob([compressed], { type: 'application/x-gzip' });
  });
}

export default class CssASTStore {
  cssASTMap: Record<string, StyleSheetPlain>;
  constructor(initCssMap?: Record<string, StyleSheetPlain>) {
    this.cssASTMap = initCssMap || {};
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

  getCssString(componentKey?: string, isBeautify = false): string {
    if (componentKey) {
      return this.cssASTMap[componentKey] ? toCSSString(this.cssASTMap[componentKey], isBeautify) : '';
    }

    return Object.entries(this.cssASTMap).map(([_, cssAst]) => toCSSString(cssAst, isBeautify)).join('');
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