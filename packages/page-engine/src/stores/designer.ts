import { observable, action, makeObservable } from 'mobx';

type SettingPanel = 'props' | 'style' | 'event' | 'renderer'

type VdomKey = 'title' | 'platformApis' | 'apiStateDetail' | string;

class DesignerStore {
  @observable activeGroup = ''
  @observable panelOpen = false
  @observable panelPinned = false
  @observable activePanel: SettingPanel = 'props'
  @observable vdoms: Record<VdomKey, React.ReactNode> = {
    title: 'qxp page engine',
  }

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
  reset = () => {

  }
}

export default new DesignerStore();
