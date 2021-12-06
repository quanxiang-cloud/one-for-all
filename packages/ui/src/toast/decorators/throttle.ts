export default function throttle(wait = 1000) {
  return function _throttle(_: unknown, __: string | symbol, descriptor: PropertyDescriptor) {
    let canRun = true;
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: unknown[]) {
      if (!canRun) {
        return;
      }
      canRun = false;
      window.setTimeout(() => {
        originalMethod.call(this, ...args);
        canRun = true;
      }, wait);
    };

    return descriptor;
  };
}
