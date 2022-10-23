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
    this.animationsContainer.interactive = true;
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

    if (
      gameState.state.name == 'EndAuction' &&
      gameState.prevState.name == 'Auction'
    ) {
      if (gameState.auction.highestBidder.id == gameState.myId) {
        this.drawYouWonAuctionText('You won the auction!');
      } else {
        this.drawYouWonAuctionText(`${gameState.auction.highestBidder.name} won the auction.`);
      }
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
    yourTurnText.y = this.height / 2;
    this.animationsContainer.addChild(yourTurnText);

    this.fade(yourTurnText, 1);
  }

  drawYouWonAuctionText(text) {
    const youWonAuctionText = new PIXI.Text(text, {
      fontFamily: 'Arial',
      fontSize: 80,
      fontWeight: 'bold',
      wordWrap: true,
      wordWrapWidth: this.width,
      fill: 0x000000,
      align: 'center',
    });
    youWonAuctionText.pivot.x = youWonAuctionText.width / 2;
    youWonAuctionText.pivot.y = youWonAuctionText.height / 2;
    youWonAuctionText.x = this.width / 2;
    youWonAuctionText.y = this.height / 2;
    this.animationsContainer.addChild(youWonAuctionText);

    this.fade(youWonAuctionText, 1);
  }

  fade(graphics, durationSeconds, smoothing = 0.05) {
    const animationTimeFrames = durationSeconds * 1000 / (1 / smoothing);
    const intervalId = setInterval(() => {
      graphics.alpha -= smoothing;
      if (graphics.alpha <= 0) {
        this.animationsContainer.removeChild(graphics);
        clearInterval(intervalId);
      }
    }, animationTimeFrames);
  }

  draw() {
    this.auctionLine = new PIXI.Graphics();
    this.animationsContainer.addChild(this.auctionLine);
  }
}
