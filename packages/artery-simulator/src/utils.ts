export function debounce<F extends (...args: any[]) => any>(
  fn: F,
): (...args: Parameters<F>) => Promise<ReturnType<F>> {
  let timeout: number;
  const debouncedFn = (...args: Parameters<F>): Promise<ReturnType<F>> => {
    cancelAnimationFrame(timeout);
    return new Promise<ReturnType<F>>((resolve) => {
      timeout = requestAnimationFrame(() => {
        const result: ReturnType<F> = fn(...args);
        resolve(result);
      });
    });
  };

  return debouncedFn;
}
