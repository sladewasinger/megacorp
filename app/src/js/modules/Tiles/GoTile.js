const PIXI = window.PIXI;

export class GoTile {
  constructor() {
    this.width = 150;
    this.height = 150;
  }

  update(gameState) { }

  draw(container, x, y, rotation = 0) {
    const tileContainer = new PIXI.Container();
    this.tileContainer = tileContainer;
    this.tileContainer.width = this.width;
    this.tileContainer.height = this.height;
    this.tileContainer.pivot = new PIXI.Point(this.width / 2, this.height / 2);

    this.tile = new PIXI.Graphics();
    this.tile.beginFill(0xffffff);
    this.tile.lineStyle(2, 0x000000, 1);
    this.tile.drawRect(0, 0, this.width, this.height);
    this.tile.endFill();
    tileContainer.addChild(this.tile);

    // eslint-disable-next-line new-cap
    const image = PIXI.Sprite.from('src/assets/GO.png');
    image.width = 189;
    image.height = 159;
    const scale = 0.8 * Math.min(this.width / image.width, this.height / image.height);
    image.width *= scale;
    image.height *= scale;
    image.x = this.width / 2 - image.width / 2;
    image.y = this.height / 2 - image.height / 2;
    tileContainer.addChild(image);

    tileContainer.x = x;
    tileContainer.y = y;
    tileContainer.rotation = rotation;
    container.addChild(tileContainer);
  }
}
