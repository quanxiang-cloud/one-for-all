import { makeObservable, observable, action, computed } from 'mobx';
import { get, set } from 'lodash';

class DataSource {
  // 普通变量, 命名兼容render-engine
  @observable sharedState = {
    test: JSON.stringify({ name: 'aa', desc: 'dd', val: { key1: 'val1', key2: 'val2' } }),
  }

  @observable apiState = {} // api变量

  @observable modalOpen = false
  @observable curSharedStateKey = ''

  constructor() {
    makeObservable(this);
  }

  @computed get curState(): any {
    const state = get(this.sharedState, this.curSharedStateKey);
    return state ? JSON.parse(state) : state;
  }

  @action
  saveSharedState = (key: string, val: any, unset?: boolean): void => {
    set(this.sharedState, key, val);
    if (unset) {
      // @ts-ignore
      delete this.sharedState[key];
    }
  }

  @action
  setModalOpen = (open: boolean): void => {
    this.modalOpen = open;
    if (!open) {
      this.setCurSharedStateKey('');
    }
  }

  @action
  setCurSharedStateKey = (key: string) => {
    this.curSharedStateKey = key;
  }

  @action
  reset = () => {

  }
}

export default new DataSource();
