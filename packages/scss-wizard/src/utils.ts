import { Selector } from './types';

export function isSelectorInWhiteList(selectorPath: string[], whiteList?: Selector[]): boolean {
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

  return isSelectorInWhiteList(selectorPath.slice(1), currentLevel.nestedSelector);
}
