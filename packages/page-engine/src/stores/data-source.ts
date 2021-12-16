import { makeObservable, observable, action, computed } from 'mobx';
import { get, set } from 'lodash';

import { toast } from '@ofa/ui';

class DataSource {
  // 普通变量, 命名兼容render-engine
  @observable sharedState: Record<string, any> = {
    // test: JSON.stringify({ name: 'test', desc: 'dd', val: { key1: 'val1', key2: 'val2' } }),
  }

  // api变量
  @observable apiState: Record<string, any> = {}

  @observable modalOpen = false
  @observable editorModalOpen=false // lift up editor modal, keep dom node to reduce css re-paint
  @observable curSharedStateKey = ''
  @observable curApiStateKey = ''
  @observable curApiNode: any = null // 当前选中的平台api节点
  @observable.shallow apiSpec: Record<string, any> | null = null // 选中api的 spec，包括swagger描述，method, fullPath

  constructor() {
    makeObservable(this);
  }

  @computed get curSharedState(): any {
    const state = get(this.sharedState, this.curSharedStateKey);
    return state ? JSON.parse(state) : state;
  }

  @computed get curApiState(): any {
    return get(this.apiState, this.curApiStateKey);
  }

  @action
  saveSharedState = (key: string, val: any): void => {
    if (this.curSharedState) {
      // save
      const oldKey = this.curSharedState.name;
      if (oldKey !== key) {
        set(this.sharedState, key, val);
        delete this.sharedState[key];
      }
    } else {
      // add
      set(this.sharedState, key, val);
    }
    toast.success(this.curSharedState ? '修改变量成功' : '新增变量成功');
    this.setEditorModalOpen(false);
    this.setCurSharedStateKey('');
  }

  @action
  removeSharedState = (key: string) => {
    delete this.sharedState[key];
  }

  @action
  setModalOpen = (open: boolean): void => {
    this.modalOpen = open;
  }

  @action
  setEditorModalOpen=(open: boolean): void=> {
    this.editorModalOpen = open;
  }

  @action
  setCurSharedStateKey = (key: string) => {
    this.curSharedStateKey = key;
  }

  @action
  setCurApiNode = (node: any) => {
    this.curApiNode = node;
  }

  @action
  setApiSpec = (spec: Record<string, any>) => {
    this.apiSpec = spec;
  }

  @action
  saveApiState = (key: string, val: any): void => {
    set(this.apiState, key, val);

    toast.success('新增API变量成功');
    this.setModalOpen(false);
    this.curApiStateKey = '';
  }

  @action
  removeApiState = (key: string) => {
    delete this.apiState[key];
  }

  @action
  reset = () => {

  }
}

export default new DataSource();
