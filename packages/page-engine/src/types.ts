import { Serialized, BaseNode, NodeType, APIStatesSpec, SharedStatesSpec } from '@ofa/render-engine';

export type ReactComp = React.ComponentType | React.JSXElementConstructor<any>;

export interface PageNode extends BaseNode<Serialized> {
  id: string;
  pid?: string; // only used on page-engine
  type: NodeType.ReactComponentNode | NodeType.LoopContainerNode | NodeType.HTMLNode;
  label: string;
  name?: string; // for html node
  // `packageName, packageVersion, exportName` only for react comp node
  packageName?: 'ofa-ui' | string;
  packageVersion?: 'latest' | string;
  exportName: 'page' | 'elemName' | string; // registry elem type
  children?: Array<PageNode>
}

export interface PageSchema {
  node: PageNode;
  apiStateSpec: APIStatesSpec;
  sharedStatesSpec: SharedStatesSpec;
}

export interface iconStyle {
  width: string,
  height: string
}

export type DragPos = 'up' | 'down' | 'left' | 'right' | 'inner';

// registry types
export type Category = 'basic' | 'layout' | 'form' | 'advanced' | string;

export interface SourceElement<T> {
  name: string;
  component: ReactComp;
  defaultConfig: Record<string, any>; // 表单默认配置
  configForm: ReactComp; // 属性配置组件
  icon: string;
  label: string;
  category: Category;
  iconStyle?: iconStyle;
  iconSize?: number;
  toProps?: (formData: any) => T; // 将configForm的配置项转换到 component的 props
  order?: number; // 排序权重
  hidden?: boolean; // 在source panel 隐藏
  acceptChild?: boolean; // 是否接受子节点
  exportActions?: string[]; // 对外暴露的方法名
  defaultStyle?: Record<string, any>; // 默认样式
}
