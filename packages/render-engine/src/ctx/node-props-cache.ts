import { BehaviorSubject } from 'rxjs';
import { NodePropsCache } from '../types';

class Store implements NodePropsCache {
  cache: Record<string, BehaviorSubject<unknown>>;
  cacheList: Array<string>;

  constructor(cacheList: Array<string>) {
    this.cache = {};
    this.cacheList = cacheList;
  }

  addCacheKey(key: string): void {
    // parentID.propName
    if (this.hasCacheKey(key)) {
      return;
    }
    this.cacheList.push(key);
  }

  hasCacheKey(key: string): boolean {
    return this.cacheList.includes(key);
  }

  initState(key: string) {
    if (!this.cache[key]) {
      this.cache[key] = new BehaviorSubject({} as unknown);
    }
  }

  getProps$(key: string): BehaviorSubject<unknown> | undefined {
    this.initState(key);

    return this.cache[key];
  }

  setProps(key: string, props: unknown): void {
    if (!this.cache[key]) {
      this.cache[key] = new BehaviorSubject(props);
      return;
    }

    this.cache[key].next(props);
  }

  clearProps(key: string): void {
    if (!this.cache[key]) return;

    this.cache[key].complete();

    delete this.cache[key];
  }
}

export default Store;
