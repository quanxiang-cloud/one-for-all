import { Container, Rule, Document } from 'postcss';

function isRule(parent: Container | Document | undefined): parent is Rule {
  return !!parent &&
    parent.type !== 'root' &&
    parent.type !== 'root';
}

export default function getRulePath(rule: Rule): string[] | undefined {
  if (rule.selector.startsWith('&:')) {
    return;
  }

  let pointer: Container = rule;
  const path = [];
  while (pointer) {
    if (pointer.type === 'rule') {
      path.push((pointer as Rule).selector);
    }

    if (!isRule(pointer.parent)) {
      break;
    }

    pointer = pointer.parent;
  }

  if (!path.length) {
    return;
  }

  return path.reverse();
}
