declare namespace Registry {
  type Category = 'basic' | 'layout' | 'form' | 'advanced' | string;

  interface SourceElement<T> {
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
    expose?: Record<string, any>; // 对外暴露的属性/方法
    defaultStyle?: Record<string, any>; // 样式默认配置
  }
}
