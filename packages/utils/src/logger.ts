const noop = (): void => undefined;

export default new Proxy(console, {
  get: function(target, propKey, receiver): any {
    if (window.__verbose_log__) {
      return Reflect.get(target, propKey, receiver);
    }

    if (propKey === 'warn' || propKey === 'log' || propKey === 'debug') {
      return noop;
    }

    return Reflect.get(target, propKey, receiver);
  },
});
