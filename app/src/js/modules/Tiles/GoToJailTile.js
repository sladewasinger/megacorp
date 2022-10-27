const PIXI = window.PIXI;

export class GoToJailTile {
  constructor() {
    this.width = 150;
    this.height = 150;
  }

  update(index, gameState, renderState) {
    if (renderState.mortgage) {
      this.tileContainer.alpha = 0.25;
    } else {
      this.tileContainer.alpha = 1;
    }
  }

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

    const title = new PIXI.Text('Go to Jail', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x000000,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: this.width,
    });
    title.pivot.x = title.width / 2;
    title.x = this.width / 2;
    title.y = this.height / 2 - title.height / 2;
    tileContainer.addChild(title);

    tileContainer.x = x;
    tileContainer.y = y;
    tileContainer.rotation = rotation;
    container.addChild(tileContainer);
  }
}
