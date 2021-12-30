import { Serialized, BaseNode, NodeType, APIStatesSpec, SharedStatesSpec } from '@ofa/render-engine';

// export type PrimitiveType = string | number | boolean | undefined | null
export type ReactComp = React.ComponentType | React.JSXElementConstructor<any>;

// export type LifeCycleName='didMount' | 'willUnmount'
// export type SerializedFunc={
//   type:'',
//   args: '',
//   body: ''
// };
// export type RenderRule='if' | 'for'

// export interface Node {
//   comp: string;
//   id?: string;
//   pid?: string;
//   label?: string; // 在page tree展示的名称
//   props?: Record<string, any> | null;
//   _shared?: Record<string, any>; // 页面的普通变量数据源, 只存于page节点
//   _api?: Record<string, any>; // 页面的api变量数据源, 只存于page节点
//   _stateRef?: Record<string, any>; // 节点引用的数据源的key path, 包括_shared, _api 数据, 存于page 以下的任何节点
//   _style?: React.CSSProperties; // setting panel的style配置
//   _events?: Record<string, any>; // setting panel的 events配置
//   _renderer?: Record<RenderRule, any>; // setting panel的 动态渲染配置
//   _hooks?: Record<LifeCycleName, SerializedFunc>; // 节点生命周期hook
//   children?: Array<Node>;
// }

export interface PageNode extends BaseNode<Serialized> {
  id: string;
  pid?: string; // only used on page-engine
  type: NodeType.ReactComponentNode | NodeType.LoopContainerNode;
  label: string;
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
  toProps?: (formData: any) => T; // 将configForm的配置项转换到 component的 props
  order?: number; // 排序权重
  hidden?: boolean; // 在source panel 隐藏
  acceptChild?: boolean; // 是否接受子节点
  exportActions?: string[]; // 对外暴露的方法名
  // expose?: Record<string, any>; // 对外暴露的属性/方法
  defaultStyle?: Record<string, any>; // 默认样式
}
