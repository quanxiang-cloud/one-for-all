import svgSprite from './sprite.svg';

let fetchSpritePromise: Promise<SVGAElement> | null = null;

async function getIconPathById(id: string): Promise<string> {
  if (!fetchSpritePromise) fetchSpritePromise = getSprite();
  const sprite = await fetchSpritePromise;
  return sprite.querySelector(`#${CSS.escape(id)}`)?.innerHTML || '';
}

async function getSprite(): Promise<SVGAElement> {
  const spriteText = await(await fetch(svgSprite)).text();

  const spriteParent = document.createElement('div');
  spriteParent.innerHTML = spriteText;
  return spriteParent.children[0] as SVGAElement
}

export default getIconPathById;
