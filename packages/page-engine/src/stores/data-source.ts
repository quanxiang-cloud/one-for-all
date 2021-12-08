import { makeObservable, observable, action } from 'mobx';

class DataSource {
  constructor() {
    makeObservable(this);
  }

  @action
  reset = () => {

  }
}

export default new DataSource();
