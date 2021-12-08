import { observable, computed, action, makeObservable } from 'mobx';
import { mapValues } from 'lodash';

import * as builtInElems from '../registry/elements';

const defaultElements = mapValues(builtInElems, (group) => {
  return Object.entries(group).map(([, conf]) => conf).sort((elemA, elemB) => {
    return (elemA?.order || 0) - (elemB?.order || 0);
  });
});

class RegistryStore {
  @observable elements: Record<Registry.Category, Array<Registry.SourceElement<any>>> = { ...defaultElements }
  @observable countRegisteredElem = 0

  constructor() {
    makeObservable(this);
  }

  @computed get elementMap(): Record<string, Registry.SourceElement<any>> {
    return Object.values(this.elements).flat().reduce((acc: Record<string, any>, cur: Registry.SourceElement<any>) => {
      const compName = (cur.name as string).toLowerCase();
      acc[compName] = cur;
      return acc;
    }, {});
  }

  @action
  registerElement = (name: string, component: ReactComp, options?: Record<string, any>) => {
    this.countRegisteredElem = this.countRegisteredElem + 1;
    const opts = Object.assign({ name, component }, {
      icon: 'insert_drive_file',
      label: `未命名-${this.countRegisteredElem}`,
      category: 'others',
      defaultConfig: {},
      configForm: () => null,
    }, options);
    if (this.elements[opts.category]) {
      this.elements[opts.category].push(opts);
    } else {
      this.elements[opts.category] = [opts];
    }
  }

  normalizeType = (type: string) => {
    return (type.startsWith('elem.') ? type.slice('elem.'.length) : type).toLowerCase();
  }

  getLabelByElemType = (type: string): string => {
    return this.elementMap[this.normalizeType(type)].label || '';
  }

  getElemByType = (type: string): Registry.SourceElement<any> => {
    return this.elementMap[this.normalizeType(type)];
  }

  acceptChild = (elemType: string) => {
    return this.elementMap[this.normalizeType(elemType)].acceptChild;
  }

  @action
  reset = () => {
    // todo: reset method when using singleton
  }
}

export default new RegistryStore();
