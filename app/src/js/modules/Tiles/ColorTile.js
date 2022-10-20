const PIXI = window.PIXI;

export class ColorTile {
  constructor(title, color, price) {
    this.title = title;
    this.title = this.title
      .split(' ')
      .map((word) => {
        let newWord = '';
        const maxLength = 9;
        while (word.length > 11) {
          newWord += word.substr(0, maxLength) + '-\n';
          word = word.substr(maxLength);
        }
        return newWord + word;
      })
      .join(' ');

    this.color = color;
    this.price = price;
    this.width = 100;
    this.height = 150;
  }

  update(index, gameState) {
    const gameStateTile = gameState.tiles[index];
    if (!gameStateTile) {
      console.log('no game state tile');
      return;
    }
    if (gameStateTile.ownerId) {
      const owner = gameState.players.find((player) => player.id === gameStateTile.ownerId);
      // color tile to owner's color
      this.tile.clear();
      this.tile.beginFill(owner.color);
      this.tile.lineStyle(2, 0x000000, 1);
      this.tile.drawRect(0, 0, this.width, this.height);
      this.tile.endFill();
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

    const colorBar = new PIXI.Graphics();
    colorBar.beginFill(this.color);
    colorBar.lineStyle(2, 0x000000, 1);
    colorBar.drawRect(0, 0, this.width, 30);
    colorBar.endFill();
    tileContainer.addChild(colorBar);

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
    title.y = colorBar.height;
    tileContainer.addChild(title);

    const price = new PIXI.Text(`$${this.price}`, {
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
  }
}
