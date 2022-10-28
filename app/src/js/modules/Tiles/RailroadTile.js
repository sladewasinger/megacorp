const PIXI = window.PIXI;

export class RailroadTile {
  update(gameState) { }

  constructor(title, color, price) {
    this.name = title;
    this.title = title
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

  update(index, gameState, renderState) {
    this.renderState = renderState;
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

    if (gameStateTile.mortgaged) {
      this.noSymbolImage.visible = true;
    } else {
      this.noSymbolImage.visible = false;
    }

    if (renderState.propertyActionInProgress) {
      if (gameStateTile.owner?.id !== gameState.currentPlayer.id) {
        this.tileContainer.alpha = 0.25;
        this.tileContainer.buttonMode = false;
      } else {
        if (renderState.propertyAction == 'mortgage') {
          if (gameStateTile.mortgaged) {
            this.tileContainer.alpha = 0.25;
            this.tileContainer.buttonMode = false;
          } else {
            this.tileContainer.alpha = 1;
            this.tileContainer.buttonMode = true;
          }
        } else if (renderState.propertyAction == 'unmortgage') {
          if (gameStateTile.mortgaged) {
            this.tileContainer.alpha = 1;
            this.tileContainer.buttonMode = true;
          } else {
            this.tileContainer.alpha = 0.25;
            this.tileContainer.buttonMode = false;
          }
        }
      }
    } else {
      this.tileContainer.alpha = 1;
      this.tileContainer.buttonMode = false;
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
      fontSize: 18,
      fill: 0x000000,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: this.width,
    });
    title.pivot.x = title.width / 2;
    title.x = this.width / 2;
    tileContainer.addChild(title);

    const image = PIXI.Sprite.from('src/assets/railroad.png');
    image.width = 69;
    image.height = 50;
    image.x = this.width / 2 - image.width / 2;
    image.y = this.height / 2 - image.height / 2;
    tileContainer.addChild(image);

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

    this.noSymbolImage = PIXI.Sprite.from('src/assets/no_sign.png');
    const noSymbolScale = 0.5 *
      Math.min(this.width / this.noSymbolImage.width, this.height / this.noSymbolImage.height);
    this.noSymbolImage.width *= noSymbolScale;
    this.noSymbolImage.height *= noSymbolScale;
    this.noSymbolImage.x = this.width / 2 - this.noSymbolImage.width / 2;
    this.noSymbolImage.y = this.height / 2 - this.noSymbolImage.height / 2 + 20;
    tileContainer.addChild(this.noSymbolImage);
    this.noSymbolImage.visible = false;

    tileContainer.x = x;
    tileContainer.y = y;
    tileContainer.rotation = rotation;

    tileContainer.interactive = true;
    tileContainer.buttonMode = false;
    tileContainer.on('click', () => {
      if (this.renderState.propertyActionInProgress) {
        switch (this.renderState.propertyAction) {
          case 'mortgage':
            this.renderState?.mortgageCallback(this);
            break;
          case 'unmortgage':
            this.renderState?.unmortgageCallback(this);
            break;
          case 'buyHouse':
            this.renderState?.buyHouseCallback(this);
            break;
          case 'sellHouse':
            this.renderState?.sellHouseCallback(this);
            break;
          default:
            break;
        }
      }
    });
    container.addChild(tileContainer);
  }
}
