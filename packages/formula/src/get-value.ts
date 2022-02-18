import { Variables } from './type';

const reg = /^\[(\d+)\]$/;

export function getValue(variables: Variables, path: string): string | number | boolean {
  let value = JSON.parse(JSON.stringify(variables));
  for (const fragment of path.split('.')) {
    const result = reg.exec(fragment);
    if (result) {
      value = value[parseInt(result[1])];
    } else {
      value = value[fragment];
    }

    if (value === undefined || value === null) {
      throw new Error(`variable name "${path}" undefined`);
    }
  }

  return value;
}
