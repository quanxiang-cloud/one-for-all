class GetIconInSprite {
  private spriteMap: Record<string, Element>;
  private isRequesting: Record<string, boolean>;
  private watcher: Record<string, ((value: string | PromiseLike<string>) => void)[]>;

  constructor(){
    this.spriteMap = {};
    this.isRequesting = {};
    this.watcher = {};
  }

  async getIconById(spriteUrl: string, id: string): Promise<SVGSymbolElement> {
    if (!this.spriteMap[spriteUrl]) {
      this.setSprite(spriteUrl, await this.fetchSprite(spriteUrl));
    }
    return this.spriteMap[spriteUrl].querySelector(`#${CSS.escape(id)}`) as SVGSymbolElement;
  }

  async fetchSprite(spriteUrl: string): Promise<string> {
    if (this.isRequesting[spriteUrl]) {
      return new Promise((resolve) => {
        if (!this.watcher[spriteUrl])
          this.watcher[spriteUrl] = [resolve];
        this.watcher[spriteUrl].push(resolve);
      })
    }

    this.isRequesting[spriteUrl] = true;
    const svgText = await(await fetch(spriteUrl)).text();
    delete this.isRequesting[spriteUrl];
    return svgText;
  }

  setSprite(key: string, value: string) {
    if (this.spriteMap[key]) return;
    const spriteParent = document.createElement('div');
    spriteParent.innerHTML = value;
    this.spriteMap[key] = spriteParent.children[0];

    this.watcher[key].forEach(resolve => resolve(value));
    delete this.watcher[key];
  }
}

export default new GetIconInSprite();
