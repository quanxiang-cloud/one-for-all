export function toRenderSchema(page_schema: PageEngine.Node): any {
  // todo
  return {};
}

export function toPageSchema(render_schema: any): PageEngine.Node {
  return {
    comp: 'page',
    children: [],
  };
}
