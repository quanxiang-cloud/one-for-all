type ReactComp = React.ComponentType | React.JSXElementConstructor<any>;
type PrimitiveType = string | number | boolean | undefined | null

declare module '*.m.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare namespace PageEngine {
  interface Node {
    comp: string;
    id?: string;
    pid?: string;
    label?: string; // 在page tree展示的名称
    props?: Record<string, any> | null;
    _dataSource?: Record<string, any>; // 节点绑定的数据源
    _style?: React.CSSProperties; // setting panel的style配置
    _events?: Record<string, any>; // setting panel的 events配置
    _renderer?: Record<string, any>; // setting panel的 动态渲染配置
    children?: Array<Node | PrimitiveType>;
  }

  type DragPos = 'up' | 'down' | 'left' | 'right' | 'inner';

  // api action
  type ApiItem = (...args: any) => Promise<any>;
}
