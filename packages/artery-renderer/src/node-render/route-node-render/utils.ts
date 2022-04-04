// trim begin and last slash
export function trimSlash(path: string): string {
  return path.replace(/^\/|\/$/g, '');
}

export function isParamHolder(fragment: string): boolean {
  return /^:[a-zA-Z_][[a-zA-Z_$0-9]+$/.test(fragment);
}
