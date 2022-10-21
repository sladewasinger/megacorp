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
  }

  setPosition(x, y) {
    this.buttonsContainer.x = x;
    this.buttonsContainer.y = y;
  }

  update(gameState, renderState) {
    if (renderState.animationInProgress ||
      renderState.auctionInProgress ||
      gameState.currentPlayer.id !== gameState.myId ||
      gameState.state.name == 'TurnStart') {
      this.disable();
      return;
    } else {
      this.enable();
    }

    if (gameState.state.type == 'property') {
      this.disableEndTurnButton();
      this.enableBuyAndAuctionButtons();
    } else {
      this.enableEndTurnButton();
      this.disableBuyAndAuctionButtons();
    }
  }

  disable() {
    this.buyPropertyButton.interactive = false;
    this.buyPropertyButton.buttonMode = false;
    this.buyPropertyButton.alpha = 0.5;
    this.auctionPropertyButton.interactive = false;
    this.auctionPropertyButton.buttonMode = false;
    this.auctionPropertyButton.alpha = 0.5;
    this.endTurnButton.interactive = false;
    this.endTurnButton.buttonMode = false;
    this.endTurnButton.alpha = 0.5;
  }

  enable() {
    this.buyPropertyButton.interactive = true;
    this.buyPropertyButton.buttonMode = true;
    this.buyPropertyButton.alpha = 1;
    this.auctionPropertyButton.interactive = true;
    this.auctionPropertyButton.buttonMode = true;
    this.auctionPropertyButton.alpha = 1;
    this.endTurnButton.interactive = true;
    this.endTurnButton.buttonMode = true;
    this.endTurnButton.alpha = 1;
  }

  enableBuyAndAuctionButtons() {
    this.buyPropertyButton.interactive = true;
    this.buyPropertyButton.buttonMode = true;
    this.buyPropertyButton.alpha = 1;
    this.auctionPropertyButton.interactive = true;
    this.auctionPropertyButton.buttonMode = true;
    this.auctionPropertyButton.alpha = 1;
  }

  disableBuyAndAuctionButtons() {
    this.buyPropertyButton.interactive = false;
    this.buyPropertyButton.buttonMode = false;
    this.buyPropertyButton.alpha = 0.5;
    this.auctionPropertyButton.interactive = false;
    this.auctionPropertyButton.buttonMode = false;
    this.auctionPropertyButton.alpha = 0.5;
  }

  disableEndTurnButton() {
    this.endTurnButton.interactive = false;
    this.endTurnButton.buttonMode = false;
    this.endTurnButton.alpha = 0.5;
  }

  enableEndTurnButton() {
    this.endTurnButton.interactive = true;
    this.endTurnButton.buttonMode = true;
    this.endTurnButton.alpha = 1;
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
