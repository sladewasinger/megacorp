export class WaterWorksTile {
  constructor() {
    this.title = 'Water Works';
    this.width = 100;
    this.height = 150;
  }

  onHover() {

  }

  update(index, gameState, renderState) {
    const gameStateTile = gameState.tiles[index];
    if (!gameStateTile) {
      console.log('no game state tile');
      return;
    }
    if (gameStateTile.owner) {
      // const owner = gameState.players.find((player) => player.id === gameStateTile.ownerId);
      // color tile to owner's color
      this.tile.clear();
      this.tile.beginFill(gameStateTile.owner.color);
      this.tile.lineStyle(2, 0x000000, 1);
      this.tile.drawRect(0, 0, this.width, this.height);
      this.tile.endFill();
    }

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

    const title = new PIXI.Text(this.title, {
      fontFamily: 'Arial',
      fontSize: 19,
      fill: 0x000000,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: this.width,
    });
    title.pivot.x = title.width / 2;
    title.x = this.width / 2;
    title.y = 0;
    tileContainer.addChild(title);

    const image = PIXI.Sprite.from('src/assets/water_works.png');
    image.width = 210;
    image.height = 175;
    const scale = 0.7 * Math.min(this.width / image.width, this.height / image.height);
    image.width *= scale;
    image.height *= scale;
    image.x = this.width / 2 - image.width / 2;
    image.y = this.height / 2 - image.height / 2 + 10;
    tileContainer.addChild(image);

    const price = new PIXI.Text('$150', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x000000,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: this.width,
    });
    price.pivot.x = price.width / 2;
    price.x = this.width / 2;
    price.y = this.height - 30;
    tileContainer.addChild(price);

    tileContainer.x = x;
    tileContainer.y = y;
    tileContainer.rotation = rotation;
    container.addChild(tileContainer);

    const statusCard = new PIXI.Container();
    statusCard.visible = false;

    const statusCardTile = new PIXI.Graphics();
    statusCardTile.beginFill(0xffffff);
    statusCardTile.lineStyle(2, 0x000000, 1);
    statusCardTile.drawRect(0, 0, this.width * 2, this.height * 2);
    statusCardTile.endFill();
    statusCardTile.with = this.width * 2;
    statusCardTile.height = this.height * 2;
    statusCardTile.pivot = new PIXI.Point(statusCardTile.width / 2, statusCardTile.height / 2);
    statusCardTile.x = 0;
    statusCardTile.y = 0;
    statusCardTile.hitArea = new PIXI.Rectangle(0, 0, statusCardTile.width, statusCardTile.height);
    statusCard.addChild(statusCardTile);

    statusCard.x = container._width - this.height - statusCardTile.width / 2 - 10;
    statusCard.y = container._height - this.height - statusCardTile.height / 2 - 10;

    const statusCardTitle = new PIXI.Text(this.title, {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x000000,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: this.width * 2,
    });
    statusCardTitle.pivot.x = statusCardTitle.width / 2;
    statusCardTitle.x = 0;
    statusCardTitle.y = 0 - statusCardTile.height / 2 + 10;
    statusCard.addChild(statusCardTitle);

    this.statusCardText = new PIXI.Text(
      'If one Utility is owned, rent is 10 times amount shown on dice. ' +
      'If both Utilities are owned, rent is 20 times amount shown on dice.' +
      '\n\nMortgage Value: $75',
      {
        fontFamily: 'Arial',
        fontSize: 18,
        fill: 0x000000,
        align: 'center',
        wordWrap: true,
        wordWrapWidth: statusCardTile.width,
      },
    );
    this.statusCardText.pivot.x = this.statusCardText.width / 2;
    this.statusCardText.x = 0;
    this.statusCardText.y = -this.statusCardText.height / 2;
    statusCard.addChild(this.statusCardText);

    tileContainer.interactive = true;
    tileContainer.on('mouseover', () => {
      statusCard.visible = true;
    });
    tileContainer.on('mouseout', () => {
      statusCard.visible = false;
    });
    container.addChild(statusCard);
  }
}
