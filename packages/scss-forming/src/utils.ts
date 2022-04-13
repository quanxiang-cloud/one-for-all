import { Container, Rule } from 'postcss';
import { FormingRule } from './types';

export function isSelectorInWhiteList(selectorPath: string[], whiteList?: FormingRule[]): boolean {
  if (!selectorPath.length) {
    return true;
  }

  if (!whiteList) {
    return false;
  }

  if (selectorPath[0].startsWith('&:')) {
    return isSelectorInWhiteList(selectorPath.slice(1), whiteList);
  }

  const currentLevel = whiteList.find(({ selector }) => selector === selectorPath[0]);
  if (!currentLevel) {
    return false;
  }

  return isSelectorInWhiteList(selectorPath.slice(1), currentLevel.nestedSelectors);
}

export function getSelectorPath(rule: Container): string[] {
  let pointer: Container | undefined = rule;
  const path = [];
  while (pointer) {
    path.push((pointer as Rule).selector);
    if (rule.parent?.type === 'root') {
      break;
    }

    if (pointer !== rule.parent) {
      // @ts-ignore
      pointer = rule.parent;
    } else {
      break;
    }
  }

  return path.reverse();
}
