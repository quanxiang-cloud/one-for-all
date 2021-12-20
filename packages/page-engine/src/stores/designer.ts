import { observable, action, makeObservable } from 'mobx';

type SettingPanel = 'props' | 'style' | 'event' | 'renderer'

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

  constructor() {
    makeObservable(this);
  }

  @action
  setActiveGroup = (group: string) => {
    this.activeGroup = group;
  }

  @action
  setPanelOpen = (open: boolean) => {
    this.panelOpen = open;
    if (!open) {
      this.setPanelPinned(false);
    }
  }

  @action
  setPanelPinned = (pin: boolean) => {
    this.panelPinned = pin;
  }

  checkPanel = () => {
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
  openDataBinding=(fieldName: string)=> {
    this.modalBindStateOpen = true;
    this.activeFieldName = fieldName;
  }

  @action
  setModalBindRender=(open:boolean)=> {
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
  }
}

export default new DesignerStore();
