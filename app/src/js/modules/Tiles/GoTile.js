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

    const title = new PIXI.Text('Go', {
      fontFamily: 'Arial',
      fontSize: 60,
      fill: 0x000000,
      align: 'center',
    });
    title.pivot.x = title.width / 2;
    title.x = this.width / 2;
    title.y = this.height / 2 - title.height / 2;
    tileContainer.addChild(title);

    const arrow = new PIXI.Text('<--', {
      fontFamily: 'monospace',
      fontSize: 48,
      fill: 0xff0000,
      align: 'center',
    });
    arrow.pivot.x = arrow.width / 2;
    arrow.pivot.y = arrow.height / 2;
    arrow.x = this.width / 2;
    arrow.y = this.height / 2 + title.height / 2 + 10;
    tileContainer.addChild(arrow);

    tileContainer.x = x;
    tileContainer.y = y;
    tileContainer.rotation = rotation;
    container.addChild(tileContainer);
  }
}
