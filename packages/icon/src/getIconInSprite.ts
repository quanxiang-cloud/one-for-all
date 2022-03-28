class GetIconInSprite {
  private sprite: Element | null;
  private requestPromise: Promise<string> | null;

  constructor(){
    this.sprite = null;
    this.requestPromise = null;
  }

  async getIconById(spriteUrl: string, id: string): Promise<SVGSymbolElement> {
    this.setSprite(await this.fetchSprite(spriteUrl));
    return this.sprite?.querySelector(`#${CSS.escape(id)}`) as SVGSymbolElement;
  }

  async fetchSprite(spriteUrl: string): Promise<string> {
    if (!this.requestPromise) {
      this.requestPromise = new Promise(async (resolve) => {
        resolve(await(await fetch(spriteUrl)).text())
      })
    }
    return this.requestPromise;
  }

  setSprite(value: string) {
    if (this.sprite) return;
    const spriteParent = document.createElement('div');
    spriteParent.innerHTML = value;
    this.sprite = spriteParent.children[0];
  }
}

export default new GetIconInSprite();
