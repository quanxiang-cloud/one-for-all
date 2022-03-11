import { observable, action, computed, toJS, makeObservable } from 'mobx';
import { get, set } from 'lodash';

import { toast } from '@one-for-all/ui';

import pageStore from './page';
import eventBus from './event-bus';
import { mapShareState, mapApiState } from '../utils/schema-adapter';

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
  @observable curSharedStateKey = ''
  @observable curApiStateKey = ''
  @observable curApiId = '' // 当前选中的平台api id，以 `method: api_path` 描述

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
    this.setModalOpen(false);
    this.setCurSharedStateKey('');

    // auto save to page schema
    this.saveSharedStateToPage();

    onSaved?.();
  }

  @action
  saveSharedStateToPage=()=>{
    set(pageStore.schema, 'sharedStatesSpec', mapShareState(toJS(this.sharedState)));
  }

  @action
  saveApiStateToPage=()=>{
    set(pageStore.schema, 'apiStateSpec', mapApiState(toJS(this.apiState)));
  }

  // map render engine shared state to page schema
  mapSharedStateSpec=()=> {
    return Object.entries(pageStore.schema.sharedStatesSpec).reduce((acc: Record<string, any>, [k, v]: [string, any])=> {
      const conf = {
        name: k,
        val: JSON.stringify(toJS(v.initial)),
        desc: '',
      };
      acc[k] = JSON.stringify(conf);
      return acc;
    }, {});
  }

  // map render engine api state to page schema
  mapApiStateSpec=()=> {
    return Object.entries(pageStore.schema.apiStateSpec).reduce((acc: Record<string, any>, [k, v]: [string, any])=> {
      acc[k] = v.apiID;
      return acc;
    }, {});
  }

  @action
  removeSharedState = (key: string, onSaved?: ()=> void) => {
    delete this.sharedState[key];
    this.saveSharedStateToPage();
    onSaved?.();
  }

  @action
  setModalOpen = (open: boolean): void => {
    this.modalOpen = open;
  }

  @action
  setCurSharedStateKey = (key: string): void => {
    this.curSharedStateKey = key;
  }

  @action
  setCurApiId = (api_id: string): void => {
    this.curApiId = api_id;
  }

  @action
  saveApiState = (key: string, val: any, onSaved?: ()=> void): void => {
    set(this.apiState, key, val);

    toast.success('新增API变量成功');
    this.setModalOpen(false);
    this.curApiStateKey = '';
    this.curApiId = '';
    // clear api path
    eventBus.emit('clear:api-path');

    // auto save api state
    this.saveApiStateToPage();

    onSaved?.();
  }

  @action
  removeApiState = (key: string, onSaved?: ()=> void): void => {
    delete this.apiState[key];
    this.saveApiStateToPage();
    onSaved?.();
  }

  @action
  reset = (): void => {
    this.sharedState = {};
    this.apiState = {};
    this.modalOpen = false;
    this.curSharedStateKey = '';
    this.curApiStateKey = '';
    this.curApiId = '';
    this.curSharedVal = { ...defaultSharedVal };
  }
}

export default new DataSource();
