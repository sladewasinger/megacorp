const PIXI = window.PIXI;

export class ColorTile {
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
    const gameStateTile = gameState.tiles[index];
    this.renderState = renderState;
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

    if (gameStateTile.rents) {
      this.statusCardText.text = `Rent $${gameStateTile.rents[0]}
With 1 House $${gameStateTile.rents[0]}
With 2 Houses $${gameStateTile.rents[1]}
With 3 Houses $${gameStateTile.rents[2]}
With 4 Houses $${gameStateTile.rents[3]}
With Hotel $${gameStateTile.rents[4]}
Mortgage Value $${gameStateTile.mortgage}
Buyback Cost $${Math.floor(gameStateTile.mortgage * 1.1)}
House Cost $${gameStateTile.houseCost}
Hotel Cost $${gameStateTile.houseCost}`;
    }

    if (gameStateTile.mortgaged) {
      this.noSymbolImage.visible = true;
      this.priceText.style.fontSize = 18;
      this.priceText.text = 'Mortgaged';
      this.priceText.pivot.x = this.priceText.width / 2;
    } else {
      this.noSymbolImage.visible = false;
      this.priceText.style.fontSize = 24;
      this.priceText.text = `$${this.price}`;
      this.priceText.pivot.x = this.priceText.width / 2;
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
          if (
            gameStateTile.mortgaged &&
            gameStateTile.owner?.money >= Math.floor(gameStateTile.mortgage * 1.1)
          ) {
            this.tileContainer.alpha = 1;
            this.tileContainer.buttonMode = true;
          } else {
            this.tileContainer.alpha = 0.25;
            this.tileContainer.buttonMode = false;
          }
        } else if (renderState.propertyAction == 'buyHouse') {
          if (gameStateTile.houses <= 4 && !gameStateTile.hotel) {
            this.tileContainer.alpha = 1;
            this.tileContainer.buttonMode = true;
          } else {
            this.tileContainer.alpha = 0.25;
            this.tileContainer.buttonMode = false;
          }
        } else if (renderState.propertyAction == 'sellHouse') {
          if (gameStateTile.houses > 0) {
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

    // Houses
    for (let i = 0; i < this.houses.length; i++) {
      this.houses[i].visible = false;
    }
    for (let i = 0; i < Math.min(gameStateTile.houses, 4); i++) {
      this.houses[i].visible = true;
    }

    if (gameStateTile.hotel) {
      this.hotel.visible = true;
    } else {
      this.hotel.visible = false;
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

    this.houses = [];
    for (let i = 0; i < 4; i++) {
      const house = new PIXI.Graphics();
      house.beginFill(0x00ff00);
      house.lineStyle(2, 0x000000, 1);
      house.drawRect(0, 0, 10, 10);
      house.endFill();
      house.x = 10 + i * 15;
      house.y = 10;
      house.visible = true;
      this.houses.push(house);
      tileContainer.addChild(house);
    }

    this.hotel = new PIXI.Graphics();
    this.hotel.beginFill(0xaa0000);
    this.hotel.lineStyle(2, 0x000000, 1);
    this.hotel.drawRect(0, 0, 17, 17);
    this.hotel.endFill();
    this.hotel.x = 10 + 4 * 15;
    this.hotel.y = 7;
    this.hotel.visible = true;
    tileContainer.addChild(this.hotel);

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
    this.priceText = price;
    tileContainer.addChild(price);

    tileContainer.x = x;
    tileContainer.y = y;
    tileContainer.rotation = rotation;
    container.addChild(tileContainer);

    this.noSymbolImage = PIXI.Sprite.from('src/assets/no_sign.png');
    const scale = 0.5 * Math.min(this.width / this.noSymbolImage.width, this.height / this.noSymbolImage.height);
    this.noSymbolImage.width *= scale;
    this.noSymbolImage.height *= scale;
    this.noSymbolImage.x = this.width / 2 - this.noSymbolImage.width / 2;
    this.noSymbolImage.y = this.height / 2 - this.noSymbolImage.height / 2 + 20;
    tileContainer.addChild(this.noSymbolImage);
    this.noSymbolImage.visible = false;

    const statusCard = this.drawStatusCard(container);
    container.addChild(statusCard);

    tileContainer.interactive = true;
    tileContainer.on('mouseover', () => {
      statusCard.visible = true;
    });
    tileContainer.on('mouseout', () => {
      statusCard.visible = false;
    });
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
    tileContainer.buttonMode = false;
  }

  drawStatusCard(container) {
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

    const statusCardTileBar = new PIXI.Graphics();
    statusCardTileBar.beginFill(this.color);
    statusCardTileBar.lineStyle(2, 0x000000, 1);
    statusCardTileBar.drawRect(0, 0, this.width * 2, 60);
    statusCardTileBar.endFill();
    statusCardTileBar.x = 0 - statusCardTile.width / 2;
    statusCardTileBar.y = 0 - statusCardTile.height / 2;
    statusCard.addChild(statusCardTileBar);

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

    this.rents = [0, 0, 0, 0, 0, 0];
    this.houseCost = 0;
    this.hotelCost = 0;
    this.statusCardText = new PIXI.Text(
      `Rent $${this.rents[0]}
      With 1 House $${this.rents[0]}
      With 2 Houses $${this.rents[1]}
      With 3 Houses $${this.rents[2]}
      With 4 Houses $${this.rents[3]}
      With Hotel $${this.rents[4]}
      Mortgage Value $${this.price / 2}
      House Cost $${this.houseCost / 2}
      Hotel Cost $${this.hotelCost / 2} + 4 houses`,
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
    this.statusCardText.x = 15;
    this.statusCardText.y = -this.statusCardText.height / 2 + statusCardTileBar.height / 2;
    statusCard.addChild(this.statusCardText);
    return statusCard;
  }
}
