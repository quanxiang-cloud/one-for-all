import simulatorRef from 'REF:./simulator/index';
import { InjectElement } from './lib/fence';

export default function buildHeadElements(pluginsSrc: string, cssURLs?: Array<string>): InjectElement[] {
  const importMaps: InjectElement[] = Array.from(document.scripts)
    .filter((s) => s.type === 'systemjs-importmap')
    .map((s) => JSON.parse(s.innerText))
    .map((s) => JSON.stringify(s))
    .map((s) => ({
      name: 'script',
      attrs: { type: 'systemjs-importmap' },
      innerText: s,
    }));

  const patchSrc = pluginsSrc.startsWith('http') ? pluginsSrc : `${window.origin}${pluginsSrc}`;

  const headElements = importMaps.concat([
    // bundle TEMPORARY_PATCH_FOR_ARTERY_PLUGINS as real dll
    // todo fix me
    {
      name: 'script',
      attrs: { type: 'systemjs-importmap' },
      innerText: `{
        "imports": {
          "TEMPORARY_PATCH_FOR_ARTERY_PLUGINS": "${patchSrc}"
        }
      }`,
    },
    {
      name: 'script',
      attrs: { src: 'https://ofapkg.pek3b.qingstor.com/system@6.10.3/system.6.10.3.min.js' },
    },
    {
      name: 'script',
      attrs: { src: simulatorRef },
    },
  ]);

  const links: InjectElement[] = (cssURLs || []).map((url) => {
    return { name: 'link', attrs: { rel: 'stylesheet', href: url } };
  });

  return headElements.concat(links);
}
