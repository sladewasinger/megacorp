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
    this.drawMortgageButton();
  }

  setPosition(x, y) {
    this.buttonsContainer.x = x;
    this.buttonsContainer.y = y;
  }

  update(gameState, renderState) {
    this.renderState = renderState;
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

    if (gameState.state.type == 'property' && !gameState.state.owner) {
      this.disableEndTurnButton();
      this.enableBuyAndAuctionButtons();
    } else {
      if (gameState.state.name == 'TurnEnd') {
        this.enableEndTurnButton();
      } else {
        this.disableEndTurnButton();
      }
      this.disableBuyAndAuctionButtons();
    }

    switch (gameState.state.name) {
      case 'TurnEnd':
      case 'Bankruptcy':
        this.enableMortgageButton();
        break;
      default:
        this.disableMortgageButton();
        break;
    }

    if (renderState.mortgage) {
      this.disableEndTurnButton();
    } else {
      this.enableEndTurnButton();
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

    this.disableMortgageButton();
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

    this.enableMortgageButton();
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

  enableMortgageButton() {
    this.mortgageButton.interactive = true;
    this.mortgageButton.buttonMode = true;
    this.mortgageButton.alpha = 1;
    this.mortgageButtonText.alpha = 1;
  }

  disableMortgageButton() {
    this.mortgageButton.interactive = false;
    this.mortgageButton.buttonMode = false;
    this.mortgageButton.alpha = 0;
    this.mortgageButtonText.alpha = 0;
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

  drawMortgageButton() {
    const container = new PIXI.Container();
    container.x = 300;
    container.y = 0;
    this.buttonsContainer.addChild(container);

    this.mortgageButton = new PIXI.Graphics();
    this.mortgageButton.beginFill(0xffff00);
    this.mortgageButton.lineStyle(2, 0x000000, 1);
    this.mortgageButton.drawRect(0, 0, 100, 50);
    this.mortgageButton.endFill();
    this.mortgageButton.interactive = true;
    this.mortgageButton.buttonMode = true;
    this.mortgageButton.hitArea = new PIXI.Rectangle(0, 0, 100, 50);
    this.mortgageButton.on('pointerdown', () => {
      this.renderState.mortgage = !this.renderState.mortgage;
    });
    container.addChild(this.mortgageButton);

    this.mortgageButtonText = new PIXI.Text('Mortgage', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x000000,
      align: 'center',
    });
    this.mortgageButtonText.pivot.x = this.mortgageButtonText.width / 2;
    this.mortgageButtonText.pivot.y = this.mortgageButtonText.height / 2;
    this.mortgageButtonText.x = this.mortgageButton.x + this.mortgageButton.width / 2;
    this.mortgageButtonText.y = this.mortgageButton.y + this.mortgageButton.height / 2;
    container.addChild(this.mortgageButtonText);
  }
}
