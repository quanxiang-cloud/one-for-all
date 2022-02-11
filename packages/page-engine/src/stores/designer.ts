import { observable, action, makeObservable } from 'mobx';

type SettingPanel = 'props' | 'style' | 'event' | 'renderer' | string;

type VdomKey = 'title' | 'platformApis' | 'apiStateDetail' | string;

class DesignerStore {
  @observable activeGroup = ''
  @observable panelOpen = false
  @observable panelPinned = false
  @observable activePanel: SettingPanel = 'props'
  @observable vdoms: Record<VdomKey, React.ReactNode> = {}
  @observable modalBindStateOpen=false // 状态绑定的modal
  @observable activeFieldName='' // 当前要绑定变量的字段的name
  @observable modalBindRenderOpen=false
  @observable isLoopNode=false; // 当前节点需标记为loop node
  @observable modalComponentNodeOpen=false // componentNode的配置
  @observable isComponentNode=false // 当前节点需标记为component node
  @observable imageUrl='' // 上传的图片链接

  constructor() {
    makeObservable(this);
  }

  @action
  setActiveGroup = (group: string): void => {
    this.activeGroup = group;
  }

  @action
  setPanelOpen = (open: boolean): void => {
    this.panelOpen = open;
    if (!open) {
      this.setPanelPinned(false);
    }
  }

  @action
  setPanelPinned = (pin: boolean): void => {
    this.panelPinned = pin;
  }

  checkPanel = (): void => {
    if (!this.panelPinned) {
      this.setPanelOpen(false);
    }
  }

  @action
  setActivePanel = (panel: SettingPanel): void => {
    this.activePanel = panel;
  }

  @action
  setVdom = (keyName: VdomKey, vdom: React.ReactNode): void => {
    this.vdoms[keyName] = vdom;
  }

  @action
  setModalBindStateOpen=(open: boolean): void=> {
    this.modalBindStateOpen = open;
  }

  @action
  openDataBinding=(fieldName: string, isLoopNode?: boolean): void => {
    this.modalBindStateOpen = true;
    this.activeFieldName = fieldName;
    this.isLoopNode = !!isLoopNode;
  }

  @action
  setModalBindRender=(open:boolean): void => {
    this.modalBindRenderOpen = open;
  }

  @action
  reset = (): void => {
    this.activeGroup = '';
    this.panelOpen = false;
    this.panelPinned = false;
    this.activePanel = 'props';
    this.vdoms = {};
    this.activeFieldName = '';
    this.isLoopNode = false;
  }

  // composedNode
  @action
  setModalComponentNodeOpen=(open: boolean): void=> {
    this.modalComponentNodeOpen = open;
  }

  @action
  openComponentNodeBinding=(fieldName: string, isComponentNode?: boolean): void => {
    this.modalComponentNodeOpen = true;
    this.activeFieldName = fieldName;
    this.isComponentNode = !!isComponentNode;
  }

  @action
  setUploadImage(url: string): void {
    this.imageUrl = url;
  }
}

export default new DesignerStore();
