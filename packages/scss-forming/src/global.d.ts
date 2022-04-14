declare module 'postcss-plugin-sorting' {
  declare fn: (opts: any) => {
    postcssPlugin: string;
    Root: import('postcss').RootProcessor;
  }
  export default fn;
}
