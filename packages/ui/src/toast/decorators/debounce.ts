export default function debounce(wait = 500) {
  return function _debounce(_: unknown, __: string | symbol, descriptor: PropertyDescriptor) {
    let timeout: number;

    const originalMethod = descriptor.value;

    descriptor.value = function(...args: unknown[]) {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        timeout = 0;
        originalMethod.call(this, ...args);
      }, wait);
    };

    return descriptor;
  };
}
