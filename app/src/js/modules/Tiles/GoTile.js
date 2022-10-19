const PIXI = window.PIXI;

export class GoTile {
  update(gameState) { }

  draw(container, x, y, rotation = 0) {
    const tileContainer = new PIXI.Container();
    this.tileContainer = tileContainer;

    const width = 150;
    const height = 150;
    this.tile = new PIXI.Graphics();
    this.tile.beginFill(0xffffff);
    this.tile.lineStyle(2, 0x000000, 1);
    this.tile.drawRect(0, 0, width, height);
    this.tile.endFill();
    tileContainer.addChild(this.tile);

    const title = new PIXI.Text('Go', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x000000,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: width,
    });
    title.pivot.x = title.width / 2;
    title.x = width / 2;
    title.y = height / 2 - title.height / 2;
    tileContainer.addChild(title);

    tileContainer.x = x;
    tileContainer.y = y;
    tileContainer.rotation = rotation;
    container.addChild(tileContainer);
  }
}
