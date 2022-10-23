export class TopAnimations {
  constructor(container, width, height) {
    this.container = container;
    this.width = width;
    this.height = height;
    this.animationsContainer = new PIXI.Container();
    this.animationsContainer.x = 0;
    this.animationsContainer.y = 0;
    this.animationsContainer.width = width;
    this.animationsContainer.height = height;
    this.container.addChild(this.animationsContainer);
  }

  update(gameState, renderState, tiles) {
    if (
      (
        gameState.state.name == 'TurnStart' &&
        (gameState.prevState.name == 'TurnEnd' || !gameState.prevState) &&
        gameState.currentPlayer.id == gameState.myId
      )
    ) {
      this.drawYourTurnText();
    }
  }

  drawYourTurnText() {
    const yourTurnText = new PIXI.Text('Your Turn', {
      fontFamily: 'Arial',
      fontSize: 200,
      fontWeight: 'bold',
      fill: 0x000000,
      align: 'center',
    });
    yourTurnText.pivot.x = yourTurnText.width / 2;
    yourTurnText.pivot.y = yourTurnText.height / 2;
    yourTurnText.x = this.width / 2;
    yourTurnText.y = this.height / 2 - yourTurnText.height / 2;
    this.animationsContainer.addChild(yourTurnText);

    const intervalId = setInterval(() => {
      yourTurnText.alpha -= 0.05;
      if (yourTurnText.alpha <= 0) {
        this.animationsContainer.removeChild(yourTurnText);
        clearInterval(intervalId);
      }
    }, 25);
  }

  draw() {
    this.auctionLine = new PIXI.Graphics();
    this.animationsContainer.addChild(this.auctionLine);
  }
}
