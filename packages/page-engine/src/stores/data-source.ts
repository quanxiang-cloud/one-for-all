import { makeObservable, observable, action, computed, toJS } from 'mobx';
import { get, set } from 'lodash';

import { toast } from '@ofa/ui';

import pageStore from './page';

export type SharedVal={
  name: string;
  val: string; // json string
  desc: string;
}

const defaultSharedVal: SharedVal = {
  name: '',
  val: JSON.stringify({ key1: 'val1' }),
  desc: '',
};

class DataSource {
  // 普通变量, 命名兼容render-engine
  @observable sharedState: Record<string, any> = {}

  // api变量
  @observable apiState: Record<string, any> = {}

  @observable modalOpen = false
  @observable editorModalOpen=false // lift up editor modal, keep dom node to reduce css re-paint
  @observable curSharedStateKey = ''
  @observable curApiStateKey = ''
  @observable curApiNode: any = null // 当前选中的平台api节点
  @observable.shallow apiSpec: Record<string, any> | null = null // 选中api的 spec，包括swagger描述，method, fullPath

  @observable
  curSharedVal=defaultSharedVal; // editing shared val

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
  setCurSharedVal=(key: string | SharedVal, val?: string)=> {
    if (typeof key === 'string') {
      if (key in this.curSharedVal) {
        Object.assign(this.curSharedVal, { [key]: val });
      }
    }
    if (typeof key === 'object') {
      this.curSharedVal = key;
    }
  }

  @action
  resetCurSharedVal=()=> {
    this.curSharedVal = { ...defaultSharedVal };
  }

  @action
  saveSharedState = (key: string, val: any, onSaved?: ()=> void): void => {
    if (this.curSharedStateKey) {
      // save
      const oldKey = this.curSharedStateKey;
      if (oldKey === key && this.sharedState[oldKey] === val) {
        // data not change
        toast.success('数据未更改');
        return;
      }
      set(this.sharedState, key, val);
      if (oldKey !== key) {
        delete this.sharedState[oldKey];
      }
    } else {
      // add
      set(this.sharedState, key, val);
    }
    toast.success(this.curSharedStateKey ? '修改变量成功' : '新增变量成功');
    this.setEditorModalOpen(false);
    this.setCurSharedStateKey('');

    // auto save to page schema
    pageStore.setPageSharedStates(toJS(this.sharedState));
    onSaved?.();
  }

  @action
  removeSharedState = (key: string, onSaved?: ()=> void) => {
    delete this.sharedState[key];
    pageStore.setPageSharedStates(toJS(this.sharedState));
    onSaved?.();
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
