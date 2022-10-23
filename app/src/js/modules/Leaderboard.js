export class Leaderboard {
  constructor(container) {
    this.container = container;
    this.width = 500;
    this.height = 500;
    this.leaderboardContainer = new PIXI.Container();
    this.container.addChild(this.leaderboardContainer);
  }

  update(gameState, renderState) {
    this.gameState = gameState;
    this.renderState = renderState;
    this.setPlayerNames(gameState);
    this.setMoneyText(gameState);
  }

  setPlayerNames(gameState) {
    const sortedPlayers = [...gameState.players];
    sortedPlayers.sort((a, b) => a.name.localeCompare(b.name));

    this.playerNames.text = sortedPlayers
      .map((player) => `${player.name}`)
      .join('\n');

    this.currentPlayerOutline.height = 32;
    this.currentPlayerOutline.width = this.playerNames.width + 10;
    const currentPlayer = gameState.currentPlayer;
    const currentPlayerIndex = sortedPlayers
      .findIndex((player) => player.id == currentPlayer.id);
    this.currentPlayerOutline.y = currentPlayerIndex * 24 +
      this.leaderboardText.height + this.currentPlayerOutline.height / 2;
    this.currentPlayerOutline.x = this.playerNames.width / 2 + Math.cos(this.renderState.time / 40) * 5;
  }

  setMoneyText(gameState) {
    this.playerMoney.text = gameState.players
      .sort((a, b) => b.name - a.name)
      .map((player) => `$${player.money}`).join('\n');
    this.playerMoney.x = 25 + this.playerNames.width;
  }

  draw(x, y) {
    this.leaderboardContainer.x = x;
    this.leaderboardContainer.y = y;

    const container = new PIXI.Container();

    this.leaderboardText = new PIXI.Text('Players:', {
      fontFamily: 'Arial',
      fontSize: 24,
      fontWeight: 'bold',
      fill: 0x000000,
      align: 'center',
    });
    this.leaderboardText.x = 0;
    this.leaderboardText.y = 0;

    this.currentPlayerOutline = new PIXI.Graphics();
    // this.currentPlayerOutline.lineStyle(2, 0x000000, 1);
    this.currentPlayerOutline.beginFill(0xffff00, 0.75);
    this.currentPlayerOutline.drawRect(0, 0, this.width, 30);
    this.currentPlayerOutline.endFill();
    this.currentPlayerOutline.x = 0;
    this.currentPlayerOutline.y = 0;
    this.currentPlayerOutline.pivot.x = this.currentPlayerOutline.width / 2;
    this.currentPlayerOutline.pivot.y = this.currentPlayerOutline.height / 2;

    this.playerNames = new PIXI.Text('', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x000000,
      align: 'right',
    });
    this.playerNames.x = 0;
    this.playerNames.y = this.leaderboardText.height;

    // this.playerNamesBox = new PIXI.Graphics();
    // this.playerNamesBox.lineStyle(2, 0x000000, 1);
    // this.playerNamesBox.drawRect(0, 0, this.playerNames.width, this.playerNames.height);
    // this.playerNamesBox.endFill();
    // this.playerNamesBox.x = this.playerNames.x;
    // this.playerNamesBox.y = this.playerNames.y;
    // container.addChild(this.playerNamesBox);

    this.playerMoney = new PIXI.Text('$1500\n$1500\n$1500\n...', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x000000,
      align: 'center',
    });
    this.playerMoney.x = 10 + this.playerNames.width;
    this.playerMoney.y = this.leaderboardText.height;

    container.addChild(
      this.leaderboardText,
      this.currentPlayerOutline,
      this.playerNames,
      this.playerMoney,
    );
    this.leaderboardContainer.addChild(container);
  }
}

