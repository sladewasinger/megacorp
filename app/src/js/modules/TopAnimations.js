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
    this.gameOver = false;
    this.container.addChild(this.animationsContainer);
  }

  update(gameState, renderState, tiles) {
    if (
      (
        gameState.state.name == 'RollDice' &&
        // gameState.state.name == 'TurnStart' &&
        // (gameState.prevState.name == 'TurnEnd' || !gameState.prevState) &&
        gameState.currentPlayer.id == gameState.myId
      )
    ) {
      this.drawYourTurnText();
    }

    if (gameState.prevState.name == 'RollDice' && gameState.currentPlayer.id == gameState.myId) {
      this.clearYourTurnText();
    }

    if (
      gameState.state.name == 'EndAuction' &&
      gameState.prevState.name == 'Auction'
    ) {
      if (gameState.auction.highestBidder.id == gameState.myId) {
        this.drawWonAuctionText('You won the auction!',
          gameState.auction.highestBidder.color);
      } else {
        this.drawWonAuctionText(`${gameState.auction.highestBidder.name} won the auction ` +
          `for $${gameState.auction.highestBid}.`, gameState.auction.highestBidder.color);
      }
    }

    if (
      !this.gameOver && gameState.state.name == 'GameOver' &&
      (gameState.prevState.name == 'TurnEnd' || gameState.prevState.name == 'Bankruptcy')
    ) {
      this.gameOver = true;
      const winner = gameState.winner;
      this.drawGameWinnerText(`${winner?.name} won the game!`, winner?.color || 0x000000);
    }
  }

  drawYourTurnText() {
    if (!this.yourTurnText) {
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
      this.yourTurnText = yourTurnText;
      this.animationsContainer.addChild(yourTurnText);
    }
  }

  clearYourTurnText() {
    if (this.yourTurnText) {
      this.fade(this.yourTurnText, 1);
      this.yourTurnText = null;
    }
  }

  drawWonAuctionText(text, color) {
    const youWonAuctionText = new PIXI.Text(text, {
      fontFamily: 'Arial',
      fontSize: 80,
      fontWeight: 'bold',
      wordWrap: true,
      wordWrapWidth: this.width - 200,
      fill: color,
      align: 'center',
      dropShadow: true,
      dropShadowColor: 0x000000,
      dropShadowBlur: 10,
    });
    youWonAuctionText.pivot.x = youWonAuctionText.width / 2;
    youWonAuctionText.pivot.y = youWonAuctionText.height / 2;
    youWonAuctionText.x = this.width / 2;
    youWonAuctionText.y = this.height / 2;
    this.animationsContainer.addChild(youWonAuctionText);

    this.fade(youWonAuctionText, 2);
  }

  drawGameWinnerText(text, color) {
    const gameWinnerText = new PIXI.Text(text, {
      fontFamily: 'Arial',
      fontSize: 80,
      fontWeight: 'bold',
      wordWrap: true,
      wordWrapWidth: this.width - 200,
      fill: color,
      align: 'center',
      dropShadow: true,
      dropShadowColor: 0x000000,
      dropShadowBlur: 10,
    });
    gameWinnerText.pivot.x = gameWinnerText.width / 2;
    gameWinnerText.pivot.y = gameWinnerText.height / 2;
    gameWinnerText.x = this.width / 2;
    gameWinnerText.y = this.height / 2;
    this.animationsContainer.addChild(gameWinnerText);
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
