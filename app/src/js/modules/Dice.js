export class Dice {
  constructor(container, rollDiceCallback) {
    this.container = container;
    this.rollDiceCallback = rollDiceCallback;
  }

  setPosition(x, y) {
    this.diceContainer.x = x;
    this.diceContainer.y = y;
  }

  setNumber(number1, number2) {
    this.diceNumber1.text = number1;
    this.diceNumber2.text = number2;
  }

  update(gameState, renderState) {
    this.setNumber(gameState.dice1, gameState.dice2);

    if (renderState.animationInProgress ||
      renderState.playerMovementInProgress ||
      renderState.auctionInProgress ||
      gameState.currentPlayer.id !== gameState.myId ||
      (gameState.state.name !== 'TurnStart' && gameState.state.name !== 'JailDecision')
    ) {
      this.disable();
      return;
    } else {
      this.enable();
    }
  }

  disable() {
    this.diceContainer.interactive = false;
    this.diceContainer.buttonMode = false;
    this.diceContainer.alpha = 0.5;
  }

  enable() {
    this.diceContainer.interactive = true;
    this.diceContainer.buttonMode = true;
    this.diceContainer.alpha = 1;
  }

  draw() {
    this.diceContainer = new PIXI.Container();
    const diceWidth = 50;
    const diceHeight = 50;

    this.diceContainer.interactive = true;
    this.diceContainer.buttonMode = true;
    this.diceContainer.hitArea = new PIXI.Rectangle(0, 0, diceWidth * 2 + 10, diceHeight);
    this.diceContainer.on('pointerdown', () => {
      this.rollDiceCallback();
    });

    this.diceOutline1 = new PIXI.Graphics();
    this.diceOutline1.beginFill(0xffffff);
    this.diceOutline1.lineStyle(2, 0x000000, 1);
    this.diceOutline1.drawRect(0, 0, diceWidth, diceHeight);
    this.diceOutline1.endFill();
    this.diceContainer.addChild(this.diceOutline1);

    this.diceNumber1 = new PIXI.Text('0', {
      fontFamily: 'Arial',
      fontSize: 48,
      fill: 0x000000,
      align: 'center',
    });
    this.diceNumber1.pivot.x = this.diceNumber1.width / 2;
    this.diceNumber1.pivot.y = this.diceNumber1.height / 2;
    this.diceNumber1.x = this.diceOutline1.x + this.diceOutline1.width / 2;
    this.diceNumber1.y = this.diceOutline1.y + this.diceOutline1.height / 2;
    this.diceContainer.addChild(this.diceNumber1);

    this.diceOutline2 = new PIXI.Graphics();
    this.diceOutline2.beginFill(0xffffff);
    this.diceOutline2.lineStyle(2, 0x000000, 1);
    this.diceOutline2.drawRect(0, 0, diceWidth, diceHeight);
    this.diceOutline2.endFill();
    this.diceOutline2.x = this.diceOutline1.x + this.diceOutline1.width + 10;
    this.diceContainer.addChild(this.diceOutline2);

    this.diceNumber2 = new PIXI.Text('0', {
      fontFamily: 'Arial',
      fontSize: 48,
      fill: 0x000000,
      align: 'center',
    });
    this.diceNumber2.pivot.x = this.diceNumber2.width / 2;
    this.diceNumber2.pivot.y = this.diceNumber2.height / 2;
    this.diceNumber2.x = this.diceOutline2.x + this.diceOutline2.width / 2;
    this.diceNumber2.y = this.diceOutline2.y + this.diceOutline2.height / 2;
    this.diceContainer.addChild(this.diceNumber2);

    this.container.addChild(this.diceContainer);
  }
}
