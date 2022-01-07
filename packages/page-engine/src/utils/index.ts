import { nanoid } from 'nanoid';
import { get } from 'lodash';

// export function h(type: string, props: Record<string, any> | null, ...children: Array<PageEngine.Node> | [PrimitiveType]) {
//   return {
//     type,
//     props,
//     children,
//   };
// }

// extend json.stringify/parser to serialize and deserialize vdom
export function serialize(schema: any) {
  return JSON.stringify(schema, function(key, val) {
    if (typeof val === 'function') {
      return val.toString();
    }
    return val;
  }, 2);
}

export function isFuncSource(source: string) {
  return typeof source === 'string' && (/function/.test(source) || /\([^)]*\)\s*=>/.test(source));
}

// export function deserialize(schema_str: string) {
//   return JSON.parse(schema_str, function(key, val) {
//     if (isFuncSource(val)) {
//       // iife not pollute global env
//       return (() => {
//         return new Function('...args', `const fn = ${val}; return fn(...args)`);
//       })();
//     }
//     // handle built-in registry key
//     if (typeof val === 'string' && val.startsWith('elem.')) {
//       return registry.elementMap[val.slice('elem.'.length)].component;
//     }
//     return val;
//   });
// }

export function elemId(elemType: string): string {
  const type = elemType.replace(/elem\./, '').toLowerCase();
  return [type, nanoid(8)].join('-');
}

export function isDev() {
  return get(window, 'process.env.NODE_ENV') === 'development';
}
