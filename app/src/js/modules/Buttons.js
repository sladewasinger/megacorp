/**
 * @description
 * Takes an Array<V>, and a grouping function,
 * and returns a Map of the array grouped by the grouping function.
 *
 * @param list An array of type V.
 * @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
 *                  K is generally intended to be a property key of V.
 *
 * @returns Map of the array grouped by the grouping function.
 */
// export function groupBy<K, V>(list: Array<V>, keyGetter: (input: V) => K): Map<K, Array<V>> {
//    const map = new Map<K, Array<V>>();
function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

export class Buttons {
  constructor(container, buyPropertyCallback, auctionPropertyCallback, endTurnCallback) {
    this.container = container;
    this.buyPropertyCallback = buyPropertyCallback;
    this.auctionPropertyCallback = auctionPropertyCallback;
    this.endTurnCallback = endTurnCallback;
    this.buttonsContainer = new PIXI.Container();
    this.container.addChild(this.buttonsContainer);
  }

  draw() {
    this.drawBuyPropertyButton();
    this.drawAuctionPropertyButton();
    this.drawEndTurnButton();
    this.unmortgageButton = new Button(this.buttonsContainer, 350, -50, 100, 50, 'Buy Back', 0xffff00, 0x000000,
      () => {
        if (this.renderState.propertyAction == 'unmortgage') {
          this.renderState.propertyAction = '';
          this.renderState.propertyActionInProgress = false;
        } else {
          this.renderState.propertyAction = 'unmortgage';
          this.renderState.propertyActionInProgress = true;
        }
      });
    this.mortgageButton = new Button(this.buttonsContainer, 350, 0, 100, 50, 'Mortgage', 0xffff00, 0x000000,
      () => {
        if (this.renderState.propertyActionInProgress) {
          this.renderState.propertyActionInProgress = false;
          this.renderState.propertyAction = '';
        } else {
          this.renderState.propertyActionInProgress = true;
          this.renderState.propertyAction = 'mortgage';
        }
      });
    this.bankruptcyButton = new Button(this.buttonsContainer, 300, 0, 100, 50, 'Declare Bankruptcy',
      0xff0000, 0x000000,
      () => {
        this.renderState.declareBankruptcyCallback();
      });
    this.sellHouseButton = new Button(this.buttonsContainer, 350, 50, 100, 50, 'Sell House', 0xff0000, 0xffffff, () => {
      if (this.renderState.propertyActionInProgress) {
        this.renderState.propertyActionInProgress = false;
        this.renderState.propertyAction = '';
      } else {
        this.renderState.propertyActionInProgress = true;
        this.renderState.propertyAction = 'sellHouse';
      }
    });
    this.buyHouseButton = new Button(this.buttonsContainer, 350, 100, 100, 50, 'Buy House', 0x00ff00, 0x000000, () => {
      if (this.renderState.propertyActionInProgress) {
        this.renderState.propertyActionInProgress = false;
        this.renderState.propertyAction = '';
      } else {
        this.renderState.propertyActionInProgress = true;
        this.renderState.propertyAction = 'buyHouse';
      }
    });
    this.tradeButton = new Button(this.buttonsContainer, 500, 100, 100, 50, 'Trade', 0x00ff00, 0x000000, () => {
      console.log('Trade button pressed.');
      this.renderState?.openTradeDialogCallback();
    });
  }

  setPosition(x, y) {
    this.buttonsContainer.x = x;
    this.buttonsContainer.y = y;
  }

  update(gameState, renderState) {
    this.renderState = renderState;
    const myPlayer = gameState.players.find((player) => player.id === gameState.myId);
    if (renderState.animationInProgress ||
      renderState.playerMovementInProgress ||
      renderState.auctionInProgress ||
      gameState.currentPlayer.id !== gameState.myId ||
      gameState.state.name == 'RollDice' ||
      gameState.state.name == 'JailDecision') {
      this.disable();
      return;
    } else {
      this.enable();
    }

    // buy and auction buttons
    if (gameState.state.type == 'property' && !gameState.state.owner) {
      this.enableBuyAndAuctionButtons();
    } else {
      this.disableBuyAndAuctionButtons();
    }

    // End Turn button
    const turnEndEnabled = gameState.state.name == 'TurnEnd' &&
      !renderState.animationInProgress &&
      !renderState.playerMovementInProgress &&
      !renderState.propertyActionInProgress;
    if (turnEndEnabled) {
      this.enableEndTurnButton();
    } else {
      this.disableEndTurnButton();
    }

    // Unmortgage button
    const unmortgageEnabled = (renderState.propertyAction == 'unmortgage') || (
      (gameState.state.name == 'TurnEnd' || gameState.state.name == 'Bankruptcy') &&
      (!renderState.propertyActionInProgress || renderState.propertyAction == 'unmortgage') &&
      (gameState.tiles.filter((tile) => tile.owner?.id == myPlayer.id).some((tile) => tile.mortgaged))
    );
    if (unmortgageEnabled) {
      this.unmortgageButton.enable();
    } else {
      this.unmortgageButton.disable();
    }

    // Mortgage button
    const mortgageEnabled = renderState.propertyAction == 'mortgage' || (
      (!renderState.propertyActionInProgress || renderState.propertyAction == 'mortgage') &&
      (gameState.state.name == 'TurnEnd' || gameState.state.name == 'Bankruptcy') &&
      (gameState.tiles.filter((tile) => tile.owner?.id == myPlayer.id).some((tile) => !tile.mortgaged))
    );
    if (mortgageEnabled) {
      this.mortgageButton.enable();
    } else {
      this.mortgageButton.disable();
    }

    // Declare Bankruptcy button
    const bankruptcyEnabled = gameState.state.name == 'Bankruptcy';
    if (bankruptcyEnabled) {
      this.bankruptcyButton.enable();
    } else {
      this.bankruptcyButton.disable();
    }

    // Buy House button
    const colorTileGroups = groupBy(gameState.tiles.filter((t) => t.type == 'property'), (t) => t.color);
    let ownsAtLeastOneColorGroup = false;
    for (const [, tiles] of colorTileGroups) {
      const ownsAllTiles = tiles.every((t) => t.owner?.id == gameState.myId);
      if (ownsAllTiles) {
        ownsAtLeastOneColorGroup = true;
        break;
      }
    }
    const buyHouseEnabled = (renderState.propertyAction == 'buyHouse') || (
      (gameState.state.name == 'TurnEnd' && ownsAtLeastOneColorGroup) &&
      (!renderState.propertyActionInProgress || renderState.propertyAction == 'buyHouse') &&
      (gameState.tiles.filter((tile) => tile.owner?.id == myPlayer.id).some((tile) => tile.houses < 5)) &&
      (myPlayer.money >= 50));
    if (buyHouseEnabled) {
      this.buyHouseButton.enable();
    } else {
      this.buyHouseButton.disable();
    }

    // Sell House button
    const sellHouseEnabled = (renderState.propertyAction == 'sellHouse') || (
      (gameState.state.name == 'TurnEnd' || gameState.state.name == 'Bankruptcy') &&
      (!renderState.propertyActionInProgress || renderState.propertyAction == 'sellHouse') &&
      (gameState.tiles.filter((tile) => tile.owner?.id == myPlayer.id).some((tile) => tile.houses > 0))
    );
    if (sellHouseEnabled) {
      this.sellHouseButton.enable();
    } else {
      this.sellHouseButton.disable();
    }
  }

  disable() {
    const alpha = 0;
    this.buyPropertyButton.interactive = false;
    this.buyPropertyButton.buttonMode = false;
    this.buyPropertyButton.alpha = alpha;
    this.buyPropertyButtonText.alpha = alpha;

    this.auctionPropertyButton.interactive = false;
    this.auctionPropertyButton.buttonMode = false;
    this.auctionPropertyButton.alpha = alpha;
    this.auctionPropertyButtonText.alpha = alpha;

    this.endTurnButton.interactive = false;
    this.endTurnButton.buttonMode = false;
    this.endTurnButton.alpha = alpha;
    this.endTurnButtonText.alpha = alpha;

    this.unmortgageButton.disable();
    this.mortgageButton.disable();
    this.bankruptcyButton.disable();
    this.sellHouseButton.disable();
    this.buyHouseButton.disable();
  }

  enable() {
    this.buyPropertyButton.interactive = true;
    this.buyPropertyButton.buttonMode = true;
    this.buyPropertyButton.alpha = 1;
    this.buyPropertyButtonText.alpha = 1;

    this.auctionPropertyButton.interactive = true;
    this.auctionPropertyButton.buttonMode = true;
    this.auctionPropertyButton.alpha = 1;
    this.auctionPropertyButtonText.alpha = 1;

    this.endTurnButton.interactive = true;
    this.endTurnButton.buttonMode = true;
    this.endTurnButton.alpha = 1;
    this.endTurnButtonText.alpha = 1;

    this.unmortgageButton.enable();
    this.mortgageButton.enable();
    this.bankruptcyButton.enable();
    this.sellHouseButton.enable();
    this.buyHouseButton.enable();
  }

  enableBuyAndAuctionButtons() {
    this.buyPropertyButton.interactive = true;
    this.buyPropertyButton.buttonMode = true;
    this.buyPropertyButton.alpha = 1;
    this.buyPropertyButtonText.alpha = 1;

    this.auctionPropertyButton.interactive = true;
    this.auctionPropertyButton.buttonMode = true;
    this.auctionPropertyButton.alpha = 1;
    this.auctionPropertyButtonText.alpha = 1;
  }

  disableBuyAndAuctionButtons() {
    const alpha = 0;
    this.buyPropertyButton.interactive = false;
    this.buyPropertyButton.buttonMode = false;
    this.buyPropertyButton.alpha = alpha;
    this.buyPropertyButtonText.alpha = alpha;

    this.auctionPropertyButton.interactive = false;
    this.auctionPropertyButton.buttonMode = false;
    this.auctionPropertyButton.alpha = alpha;
    this.auctionPropertyButtonText.alpha = alpha;
  }

  disableEndTurnButton() {
    this.endTurnButton.interactive = false;
    this.endTurnButton.buttonMode = false;
    this.endTurnButton.alpha = 0;
    this.endTurnButtonText.alpha = 0;
  }

  enableEndTurnButton() {
    this.endTurnButton.interactive = true;
    this.endTurnButton.buttonMode = true;
    this.endTurnButton.alpha = 1;
    this.endTurnButtonText.alpha = 1;
  }

  drawBuyPropertyButton() {
    const container = new PIXI.Container();
    container.x = 0;
    container.y = 0;
    this.buttonsContainer.addChild(container);

    this.buyPropertyButton = new PIXI.Graphics();
    this.buyPropertyButton.beginFill(0x00ff00);
    this.buyPropertyButton.lineStyle(2, 0x000000, 1);
    this.buyPropertyButton.drawRect(0, 0, 100, 50);
    this.buyPropertyButton.endFill();

    this.buyPropertyButton.interactive = true;
    this.buyPropertyButton.buttonMode = true;
    this.buyPropertyButton.hitArea = new PIXI.Rectangle(0, 0, 100, 50);
    this.buyPropertyButton.on('pointerdown', () => {
      this.buyPropertyCallback();
    });
    container.addChild(this.buyPropertyButton);

    this.buyPropertyButtonText = new PIXI.Text('Buy', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x000000,
      align: 'center',
    });
    this.buyPropertyButtonText.pivot.x = this.buyPropertyButtonText.width / 2;
    this.buyPropertyButtonText.pivot.y = this.buyPropertyButtonText.height / 2;
    this.buyPropertyButtonText.x = this.buyPropertyButton.x + this.buyPropertyButton.width / 2;
    this.buyPropertyButtonText.y = this.buyPropertyButton.y + this.buyPropertyButton.height / 2;
    container.addChild(this.buyPropertyButtonText);
  }

  drawAuctionPropertyButton() {
    const container = new PIXI.Container();
    container.x = 100;
    container.y = 0;
    this.buttonsContainer.addChild(container);

    this.auctionPropertyButton = new PIXI.Graphics();
    this.auctionPropertyButton.beginFill(0x3333ff);
    this.auctionPropertyButton.lineStyle(2, 0x000000, 1);
    this.auctionPropertyButton.drawRect(0, 0, 100, 50);
    this.auctionPropertyButton.endFill();

    this.auctionPropertyButton.interactive = true;
    this.auctionPropertyButton.buttonMode = true;
    this.auctionPropertyButton.hitArea = new PIXI.Rectangle(0, 0, 100, 50);
    this.auctionPropertyButton.on('pointerdown', () => {
      this.auctionPropertyCallback();
    });
    container.addChild(this.auctionPropertyButton);

    this.auctionPropertyButtonText = new PIXI.Text('Auction', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x000000,
      align: 'center',
    });
    this.auctionPropertyButtonText.pivot.x = this.auctionPropertyButtonText.width / 2;
    this.auctionPropertyButtonText.pivot.y = this.auctionPropertyButtonText.height / 2;
    this.auctionPropertyButtonText.x = this.auctionPropertyButton.x + this.auctionPropertyButton.width / 2;
    this.auctionPropertyButtonText.y = this.auctionPropertyButton.y + this.auctionPropertyButton.height / 2;
    container.addChild(this.auctionPropertyButtonText);
  }

  drawEndTurnButton() {
    const container = new PIXI.Container();
    container.x = 200;
    container.y = 0;
    this.buttonsContainer.addChild(container);

    this.endTurnButton = new PIXI.Graphics();
    this.endTurnButton.beginFill(0xbb0000);
    this.endTurnButton.lineStyle(2, 0x000000, 1);
    this.endTurnButton.drawRect(0, 0, 100, 50);
    this.endTurnButton.endFill();

    this.endTurnButton.interactive = true;
    this.endTurnButton.buttonMode = true;
    this.endTurnButton.hitArea = new PIXI.Rectangle(0, 0, 100, 50);
    this.endTurnButton.on('pointerdown', () => {
      this.endTurnCallback();
    });
    container.addChild(this.endTurnButton);

    this.endTurnButtonText = new PIXI.Text('End Turn', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
      align: 'center',
    });
    this.endTurnButtonText.pivot.x = this.endTurnButtonText.width / 2;
    this.endTurnButtonText.pivot.y = this.endTurnButtonText.height / 2;
    this.endTurnButtonText.x = this.endTurnButton.x + this.endTurnButton.width / 2;
    this.endTurnButtonText.y = this.endTurnButton.y + this.endTurnButton.height / 2;
    container.addChild(this.endTurnButtonText);
  }
}

export class Button {
  constructor(container,
    x,
    y,
    width,
    height,
    text,
    backgroundColor,
    textColor,
    callback) {
    this.container = container;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.callback = callback || (() => { });

    const button = new PIXI.Container();
    button.x = this.x;
    button.y = this.y;
    button.interactive = true;
    button.buttonMode = true;
    button.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
    button.on('pointerdown', () => {
      this.callback();
    });
    this.container.addChild(button);
    this.button = button;

    this.buttonBox = new PIXI.Graphics();
    this.buttonBox.beginFill(backgroundColor);
    this.buttonBox.lineStyle(2, 0x000000, 1);
    this.buttonBox.drawRect(0, 0, this.width, this.height);
    this.buttonBox.endFill();
    button.addChild(this.buttonBox);

    const fontSize = Math.max(this.text.split(' ').sort().map((x) => x.length)) >= 8 ? 19 : 24;
    this.buttonText = new PIXI.Text(this.text, {
      fontFamily: 'Arial',
      fontSize: fontSize,
      fill: textColor,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: this.width,
    });
    this.buttonText.pivot.x = this.buttonText.width / 2;
    this.buttonText.pivot.y = this.buttonText.height / 2;
    this.buttonText.x = this.buttonBox.x + this.buttonBox.width / 2;
    this.buttonText.y = this.buttonBox.y + this.buttonBox.height / 2;
    button.addChild(this.buttonText);
  }

  update(gameState, renderState) {
    this.gameState = gameState;
    this.renderState = renderState;
  }

  disable() {
    this.button.visible = false;
    this.button.interactive = false;
  }

  enable() {
    this.button.visible = true;
    this.button.interactive = true;
  }
}
