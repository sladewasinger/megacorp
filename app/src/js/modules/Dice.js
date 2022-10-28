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

    this.leftArrow.x += Math.cos(renderState.time / 25) * 0.5;

    switch (renderState.diceState) {
      case 'idle':
        if (gameState.prevState.name == 'RollDice') {
          renderState.diceState = 'rolling';
        }
        break;
      case 'rolling':
        this.rotateDiceAnimation();
        renderState.diceState = 'rollingAnimation';
        break;
      case 'rollingAnimation':
        if (gameState.state.name == 'TurnStart') {
          renderState.diceState = 'idle';
        }
        break;
      default:
        renderState.diceState = 'idle';
        break;
    }

    if (renderState.animationInProgress ||
      renderState.playerMovementInProgress ||
      renderState.auctionInProgress ||
      gameState.currentPlayer.id !== gameState.myId ||
      (gameState.state.name !== 'RollDice' && gameState.state.name !== 'JailDecision')
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
    this.leftArrow.visible = false;
  }

  enable() {
    this.diceContainer.interactive = true;
    this.diceContainer.buttonMode = true;
    this.diceContainer.alpha = 1;
    this.leftArrow.visible = true;
  }

  rotateDiceAnimation() {
    const dice1Rotation = 2 * Math.PI;
    const dice2Rotation = 2 * Math.PI;
    const rotations = 30;
    const delay = 15;
    for (let i = 0; i < rotations; i++) {
      setTimeout(() => {
        this.diceOutline1.rotation = dice1Rotation * (i / rotations);
        this.diceOutline2.rotation = dice2Rotation * (i / rotations);
      }, i * delay);

      if (i >= rotations - 1) {
        setTimeout(() => {
          this.diceOutline1.rotation = 0;
          this.diceOutline2.rotation = 0;
        }, (i + 1) * delay);
      }
    }
  }

  draw() {
    this.diceContainer = new PIXI.Container();
    const diceWidth = 50;
    const diceHeight = 50;

    this.diceContainer.interactive = true;
    this.diceContainer.buttonMode = true;
    this.diceContainer.hitArea = new PIXI.Rectangle(0, 0, diceWidth * 2 + 10, diceHeight);
    this.diceContainer.on('pointerup', () => {
      this.rotateDiceAnimation();
      this.rollDiceCallback();
    });

    this.diceOutline1 = new PIXI.Graphics();
    this.diceOutline1.beginFill(0xffffff);
    this.diceOutline1.lineStyle(2, 0x000000, 1);
    this.diceOutline1.drawRect(0, 0, diceWidth, diceHeight);
    this.diceOutline1.endFill();
    this.diceOutline1.pivot.x = diceWidth / 2;
    this.diceOutline1.pivot.y = diceHeight / 2;
    this.diceOutline1.x = diceWidth / 2;
    this.diceOutline1.y = diceHeight / 2;
    this.diceContainer.addChild(this.diceOutline1);

    this.diceNumber1 = new PIXI.Text('0', {
      fontFamily: 'Arial',
      fontSize: 48,
      fill: 0x000000,
      align: 'center',
    });
    this.diceNumber1.pivot.x = this.diceNumber1.width / 2;
    this.diceNumber1.pivot.y = this.diceNumber1.height / 2;
    this.diceNumber1.x = this.diceOutline1.x;
    this.diceNumber1.y = this.diceOutline1.y;
    this.diceContainer.addChild(this.diceNumber1);

    this.diceOutline2 = new PIXI.Graphics();
    this.diceOutline2.beginFill(0xffffff);
    this.diceOutline2.lineStyle(2, 0x000000, 1);
    this.diceOutline2.drawRect(0, 0, diceWidth, diceHeight);
    this.diceOutline2.endFill();
    this.diceOutline2.pivot.x = diceWidth / 2;
    this.diceOutline2.pivot.y = diceHeight / 2;
    this.diceOutline2.x = this.diceOutline1.x + this.diceOutline1.width + 10;
    this.diceOutline2.y = this.diceOutline1.y;
    this.diceContainer.addChild(this.diceOutline2);

    this.diceNumber2 = new PIXI.Text('0', {
      fontFamily: 'Arial',
      fontSize: 48,
      fill: 0x000000,
      align: 'center',
    });
    this.diceNumber2.pivot.x = this.diceNumber2.width / 2;
    this.diceNumber2.pivot.y = this.diceNumber2.height / 2;
    this.diceNumber2.x = this.diceOutline2.x;
    this.diceNumber2.y = this.diceOutline2.y;
    this.diceContainer.addChild(this.diceNumber2);

    this.leftArrow = PIXI.Sprite.from('src/assets/left_arrow.png');
    this.leftArrow.pivot.x = 0;
    this.leftArrow.pivot.y = 0;
    this.leftArrow.x = this.diceNumber2.x + this.diceNumber2.width + 50;
    this.leftArrow.y = this.diceNumber2.y - this.diceNumber2.height / 2;
    this.diceContainer.addChild(this.leftArrow);

    this.container.addChild(this.diceContainer);
  }
}
