declare module '*.m.scss' {
  const classes: { [key: string]: string };
  export default classes;
}


declare interface Window {
  _ctx?: unknown
  __isDev__?: boolean
}
