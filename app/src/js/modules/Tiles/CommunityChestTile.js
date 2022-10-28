export class CommunityChestTile {
  constructor() {
    this.width = 100;
    this.height = 150;
  }

  update(index, gameState, renderState) {
    if (renderState.propertyActionInProgress) {
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

    const title = new PIXI.Text('Community Chest', {
      fontFamily: 'Arial',
      fontSize: 18,
      fill: 0x000000,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: this.width,
    });
    title.pivot.x = title.width / 2;
    title.x = this.width / 2;
    title.y = title.height / 2;
    tileContainer.addChild(title);

    // eslint-disable-next-line new-cap
    const image = PIXI.Sprite.from('src/assets/community_chest.png');
    // scale image to fit within tile
    const scale = 0.75 * Math.min(this.width / image.width, this.height / image.height);
    image.width *= scale;
    image.height *= scale;
    image.x = this.width / 2 - image.width / 2;
    image.y = this.height / 2 - 10;
    tileContainer.addChild(image);

    tileContainer.x = x;
    tileContainer.y = y;
    tileContainer.rotation = rotation;
    container.addChild(tileContainer);
  }
}
