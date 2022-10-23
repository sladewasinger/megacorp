export class BidButtons {
  constructor(container, bidCallback) {
    this.container = container;
    this.buttonsContainer = new PIXI.Container();
    this.container.addChild(this.buttonsContainer);

    this.width = 300;
    this.height = 100;

    this.currentBid = 0;
    this.bidCallback = bidCallback;
  }

  update(gameState, renderState) {
    this.currentBidText.text = `Current Bid: ${this.currentBid}`;

    const myPlayer = gameState.players.find((player) => player.id === gameState.myId);

    if (renderState.animationInProgress ||
      renderState.playerMovementInProgress ||
      gameState.state.name != 'Auction' ||
      myPlayer.hasBid
    ) {
      this.disable();
      return;
    }

    this.enable();
  }

  disable() {
    this.buttonsContainer.alpha = 0.25;

    this.bidButtonOutline.interactive = false;
    this.bidButtonOutline.buttonMode = false;

    this.plus100ButtonText.interactive = false;
    this.plus100ButtonText.buttonMode = false;

    this.plus10ButtonText.interactive = false;
    this.plus10ButtonText.buttonMode = false;

    this.minus100ButtonText.interactive = false;
    this.minus100ButtonText.buttonMode = false;

    this.minus10ButtonText.interactive = false;
    this.minus10ButtonText.buttonMode = false;

    this.zeroButton.interactive = false;
    this.zeroButton.buttonMode = false;
  }

  enable() {
    this.buttonsContainer.alpha = 1;

    this.bidButtonOutline.interactive = true;
    this.bidButtonOutline.buttonMode = true;

    this.plus100ButtonText.interactive = true;
    this.plus100ButtonText.buttonMode = true;

    this.plus10ButtonText.interactive = true;
    this.plus10ButtonText.buttonMode = true;

    this.minus100ButtonText.interactive = true;
    this.minus100ButtonText.buttonMode = true;

    this.minus10ButtonText.interactive = true;
    this.minus10ButtonText.buttonMode = true;

    this.zeroButton.interactive = true;
    this.zeroButton.buttonMode = true;
  }

  setBidAmount(amount) {
    this.currentBid = amount;
  }

  draw(x, y) {
    this.buttonsContainer.x = x;
    this.buttonsContainer.y = y;

    this.zeroButton = new PIXI.Graphics();
    this.zeroButton.beginFill(0xffffff);
    this.zeroButton.lineStyle(2, 0x000000, 1);
    this.zeroButton.drawRect(0, 0, 50, 50);
    this.zeroButton.interactive = true;
    this.zeroButton.buttonMode = true;
    this.zeroButton.on('pointerdown', () => {
      this.currentBid = 0;
    });
    this.zeroButton.hitArea = new PIXI.Rectangle(0, 0, 50, 50);
    this.buttonsContainer.addChild(this.zeroButton);

    this.zeroButtonText = new PIXI.Text('0', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x000000,
      align: 'center',
    });
    this.zeroButtonText.pivot.x = this.zeroButtonText.width / 2;
    this.zeroButtonText.pivot.y = this.zeroButtonText.height / 2;
    this.zeroButtonText.x = this.zeroButton.x + this.zeroButton.width / 2;
    this.zeroButtonText.y = this.zeroButton.y + this.zeroButton.height / 2;
    this.buttonsContainer.addChild(this.zeroButtonText);


    this.minus10ButtonOutline = new PIXI.Graphics();
    this.minus10ButtonOutline.beginFill(0xffffff);
    this.minus10ButtonOutline.lineStyle(2, 0x000000, 1);
    this.minus10ButtonOutline.drawRect(0, 0, 50, 50);
    this.minus10ButtonOutline.x = 50;
    this.buttonsContainer.addChild(this.minus10ButtonOutline);

    this.minus10ButtonText = new PIXI.Graphics();
    this.minus10ButtonText = new PIXI.Text('-10', {
      fontFamily: 'monospace',
      fontSize: 24,
      fill: 0x000000,
      align: 'center',
    });
    this.minus10ButtonText.pivot.x = this.minus10ButtonText.width / 2;
    this.minus10ButtonText.pivot.y = this.minus10ButtonText.height / 2;
    this.minus10ButtonText.x = this.minus10ButtonOutline.x + this.minus10ButtonOutline.width / 2;
    this.minus10ButtonText.y = this.minus10ButtonOutline.y + this.minus10ButtonOutline.height / 2;
    this.minus10ButtonText.interactive = true;
    this.minus10ButtonText.buttonMode = true;
    this.minus10ButtonText.hitArea = new PIXI.Rectangle(0, 0, 50, 50);
    this.minus10ButtonText.on('pointerdown', () => {
      this.currentBid -= 10;
      if (this.currentBid < 0) {
        this.currentBid = 0;
      }
    });
    this.buttonsContainer.addChild(this.minus10ButtonText);

    this.plus10ButtonOutline = new PIXI.Graphics();
    this.plus10ButtonOutline.beginFill(0xffffff);
    this.plus10ButtonOutline.lineStyle(2, 0x000000, 1);
    this.plus10ButtonOutline.drawRect(0, 0, 50, 50);
    this.plus10ButtonOutline.x = 100;
    this.buttonsContainer.addChild(this.plus10ButtonOutline);

    this.plus10ButtonText = new PIXI.Text('+10', {
      fontFamily: 'monospace',
      fontSize: 24,
      fill: 0x000000,
      align: 'center',
    });
    this.plus10ButtonText.pivot.x = this.plus10ButtonText.width / 2;
    this.plus10ButtonText.pivot.y = this.plus10ButtonText.height / 2;
    this.plus10ButtonText.x = this.plus10ButtonOutline.x + this.plus10ButtonOutline.width / 2;
    this.plus10ButtonText.y = this.plus10ButtonOutline.y + this.plus10ButtonOutline.height / 2;
    this.plus10ButtonText.interactive = true;
    this.plus10ButtonText.buttonMode = true;
    this.plus10ButtonText.hitArea = new PIXI.Rectangle(0, 0, 50, 50);
    this.plus10ButtonText.on('pointerdown', () => {
      this.currentBid += 10;
    });
    this.buttonsContainer.addChild(this.plus10ButtonText);

    this.minus100ButtonOutline = new PIXI.Graphics();
    this.minus100ButtonOutline.beginFill(0xffffff);
    this.minus100ButtonOutline.lineStyle(2, 0x000000, 1);
    this.minus100ButtonOutline.drawRect(0, 0, 50, 50);
    this.minus100ButtonOutline.x = 150;
    this.buttonsContainer.addChild(this.minus100ButtonOutline);

    this.minus100ButtonText = new PIXI.Text('-100', {
      fontFamily: 'monospace',
      fontSize: 20,
      fill: 0x000000,
      align: 'center',
    });
    this.minus100ButtonText.pivot.x = this.minus100ButtonText.width / 2;
    this.minus100ButtonText.pivot.y = this.minus100ButtonText.height / 2;
    this.minus100ButtonText.x = this.minus100ButtonOutline.x + this.minus100ButtonOutline.width / 2;
    this.minus100ButtonText.y = this.minus100ButtonOutline.y + this.minus100ButtonOutline.height / 2;
    this.minus100ButtonText.interactive = true;
    this.minus100ButtonText.buttonMode = true;
    this.minus100ButtonText.hitArea = new PIXI.Rectangle(0, 0, 50, 50);
    this.minus100ButtonText.on('pointerdown', () => {
      this.currentBid -= 100;
      if (this.currentBid < 0) {
        this.currentBid = 0;
      }
    });
    this.buttonsContainer.addChild(this.minus100ButtonText);

    this.plus100ButtonOutline = new PIXI.Graphics();
    this.plus100ButtonOutline.beginFill(0xffffff);
    this.plus100ButtonOutline.lineStyle(2, 0x000000, 1);
    this.plus100ButtonOutline.drawRect(0, 0, 50, 50);
    this.plus100ButtonOutline.x = 200;
    this.buttonsContainer.addChild(this.plus100ButtonOutline);

    this.plus100ButtonText = new PIXI.Text('+100', {
      fontFamily: 'monospace',
      fontSize: 20,
      fill: 0x000000,
      align: 'center',
    });
    this.plus100ButtonText.pivot.x = this.plus100ButtonText.width / 2;
    this.plus100ButtonText.pivot.y = this.plus100ButtonText.height / 2;
    this.plus100ButtonText.x = this.plus100ButtonOutline.x + this.plus100ButtonOutline.width / 2;
    this.plus100ButtonText.y = this.plus100ButtonOutline.y + this.plus100ButtonOutline.height / 2;
    this.plus100ButtonText.interactive = true;
    this.plus100ButtonText.buttonMode = true;
    this.plus100ButtonText.hitArea = new PIXI.Rectangle(0, 0, 50, 50);
    this.plus100ButtonText.on('pointerdown', () => {
      this.currentBid += 100;
    });
    this.buttonsContainer.addChild(this.plus100ButtonText);

    this.bidButton = new PIXI.Graphics();

    this.bidButtonOutline = new PIXI.Graphics();
    this.bidButtonOutline.beginFill(0xffffff);
    this.bidButtonOutline.lineStyle(2, 0x000000, 1);
    this.bidButtonOutline.drawRect(0, 0, 100, 50);
    this.bidButtonOutline.x = 260;
    this.bidButtonOutline.interactive = true;
    this.bidButtonOutline.buttonMode = true;
    this.bidButtonOutline.hitArea = new PIXI.Rectangle(0, 0, 100, 50);
    this.bidButtonOutline.on('pointerdown', () => {
      this.bidCallback(this.currentBid);
    });
    this.bidButton.addChild(this.bidButtonOutline);

    this.bidButtonText = new PIXI.Text('Bid', {
      fontFamily: 'monospace',
      fontSize: 30,
      fill: 0x000000,
      align: 'center',
    });
    this.bidButtonText.pivot.x = this.bidButtonText.width / 2;
    this.bidButtonText.pivot.y = this.bidButtonText.height / 2;
    this.bidButtonText.x = this.bidButtonOutline.x + this.bidButtonOutline.width / 2;
    this.bidButtonText.y = this.bidButtonOutline.y + this.bidButtonOutline.height / 2;
    this.bidButton.addChild(this.bidButtonText);
    this.buttonsContainer.addChild(this.bidButton);

    this.currentBidText = new PIXI.Text(`Current Bid: 000`, {
      fontFamily: 'monospace',
      fontSize: 24,
      fill: 0x000000,
      align: 'center',
    });
    this.currentBidText.pivot.x = this.currentBidText.width / 2;
    this.currentBidText.pivot.y = this.currentBidText.height / 2;
    this.currentBidText.x = this.bidButtonOutline.x + this.bidButtonOutline.width - this.currentBidText.width / 2;
    this.currentBidText.y = 75;
    this.buttonsContainer.addChild(this.currentBidText);
  }
}
