declare module 'dll:*' {
  const v: string;
  export default v;
}

declare module 'TEMPORARY_PATCH_FOR_ARTERY_PLUGINS' {
  const v: import('@one-for-all/artery-renderer').Plugins = {};
  export default v;
}

declare interface Window {
  __OVER_LAYER_COMPONENTS: Array<{ packageName: string; exportName: string; }>;
}
