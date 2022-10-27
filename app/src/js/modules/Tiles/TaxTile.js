export class TaxTile {
  constructor(name) {
    this.name = name;
    this.width = 100;
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

    const title = new PIXI.Text(this.name, {
      fontFamily: 'Arial',
      fontSize: 20,
      fontWeight: 'bold',
      fill: 0x000000,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: this.width,
    });
    title.pivot.x = title.width / 2;
    title.x = this.width / 2;
    title.y = this.height / 2 - title.height;
    tileContainer.addChild(title);

    this.costText = new PIXI.Text('$200', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xaa0000,
      fontWeight: 'bold',
    });
    this.costText.pivot.x = this.costText.width / 2;
    this.costText.x = this.width / 2;
    this.costText.y = 85;
    tileContainer.addChild(this.costText);

    // const image = PIXI.Sprite.from('src/assets/tax.png');
    // image.width = 115;
    // image.height = 127;
    // const scale = 0.4;
    // image.width *= scale;
    // image.height *= scale;
    // image.x = this.width / 2 - image.width / 2;
    // image.y = this.height / 2 - image.height / 2 + 30;
    // tileContainer.addChild(image);

    tileContainer.x = x;
    tileContainer.y = y;
    tileContainer.rotation = rotation;
    container.addChild(tileContainer);
  }
}
