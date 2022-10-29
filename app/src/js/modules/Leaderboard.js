export class Leaderboard {
  constructor(container) {
    this.container = container;
    this.width = 500;
    this.height = 500;
    this.leaderboardContainer = new PIXI.Container();
    this.container.addChild(this.leaderboardContainer);
    this.players = null;
  }

  update(gameState, renderState, boardPlayers) {
    this.gameState = gameState;
    this.renderState = renderState;
    if (!this.players) {
      this.drawPlayersInitial(gameState);
    }

    this.setCurrentPlayerArrow(gameState, boardPlayers);

    let showingLine = false;
    for (const player of this.players) {
      if (player.playerText.mouseHovering) {
        this.showLineToPlayer(gameState, player, boardPlayers);
        showingLine = true;
      }
    }
    if (!showingLine) {
      this.hideLineToPlayer();
    }
  }

  showLineToPlayer(gameState, player, boardPlayers) {
    const lineStart = {
      x: player.playerText.x + 10,
      y: player.playerText.y + 20,
    };
    const boardPlayer = boardPlayers.find((p) => p.id == player.id);
    const lineEnd = {
      x: boardPlayer.position.x - this.leaderboardContainer.x,
      y: boardPlayer.position.y - this.leaderboardContainer.y,
    };
    const line = this.playerPosLine;
    line.visible = true;
    line.clear();
    line.lineStyle(2, 0x000000, 1);
    line.moveTo(lineStart.x, lineStart.y);
    line.lineTo(lineEnd.x, lineEnd.y);
  }

  hideLineToPlayer() {
    this.playerPosLine.visible = false;
  }

  setCurrentPlayerArrow(gameState, boardPlayers) {
    const sortedPlayers = [...gameState.players];
    sortedPlayers.sort((a, b) => a.turnOrder - b.turnOrder);

    const currentPlayer = gameState.currentPlayer;
    const currentPlayerIndex = sortedPlayers
      .findIndex((player) => player.id == currentPlayer.id);
    this.currentPlayerIndicator.y = 5 + currentPlayerIndex * 30 +
      this.leaderboardText.height;
    this.currentPlayerIndicator.x = -35 + Math.cos(this.renderState.time / 30) * 5;

    const playerBoardToken = boardPlayers.find((p) => p.id == currentPlayer.id);
    if (playerBoardToken) {
      const rotation = Math.PI / 2;
      const offset = {
        x: 39,
        y: -50 + Math.cos(this.renderState.time / 30) * 10,
      };
      // if (currentPlayer.position >= 0 && currentPlayer.position <= 10) {
      //   rotation = Math.PI / 2;
      // } else if (currentPlayer.position > 10 && currentPlayer.position < 20) {
      //   rotation = Math.PI;
      // } else if (currentPlayer.position > 30 && currentPlayer.position < 40) {
      //   rotation = - Math.PI / 2;
      // }
      this.currentPlayerIndicator2.rotation = rotation;

      this.currentPlayerIndicator2.x = playerBoardToken.position.x - this.leaderboardContainer.x -
        playerBoardToken.width / 2 + offset.x;
      this.currentPlayerIndicator2.y = playerBoardToken.position.y - this.leaderboardContainer.y -
        playerBoardToken.height / 2 + offset.y;
    }
  }

  setMoneyText(gameState) {
    if (!this.players) {
      return;
    }
    for (const player of this.players) {
      const gameStatePlayer = gameState.players.find((p) => p.id == player.id);
      if (gameStatePlayer) {
        player.money = gameStatePlayer.money;
        player.moneyText.text = `$${player.money}`;
      }
    }
  }

  drawPlayersInitial(gameState) {
    this.players = [];
    let index = 0;
    for (const player of gameState.players.sort((a, b) => a.turnOrder - b.turnOrder)) {
      const playerText = new PIXI.Text(player.name, {
        fontFamily: 'Arial',
        fontSize: 30,
        fill: player.color,
        stroke: 0x000000,
        strokeThickness: 4,
        letterSpacing: 2,
        // dropShadow: true,
        // dropShadowColor: 0x000000,
        // dropShadowBlur: 4,
        // dropShadowDistance: 2,
        align: 'left',
      });
      playerText.x = 0;
      playerText.y = this.leaderboardText.height + index * 30;
      playerText.interactive = true;
      playerText.on('mouseover', () => {
        playerText.mouseHovering = true;
      });
      playerText.on('mouseout', () => {
        playerText.mouseHovering = false;
      });
      this.leaderboardContainer.addChild(playerText);

      const moneyText = new PIXI.Text(`$${player.money}`, {
        fontFamily: 'monospace',
        fontSize: 32,
        fill: 0x000000,
        align: 'left',
      });
      moneyText.x = 10 + playerText.width;
      moneyText.y = 2 + this.leaderboardText.height + index * 30;
      this.leaderboardContainer.addChild(moneyText);

      const p = {
        name: player.name,
        id: player.id,
        index: index,
        playerText: playerText,
        moneyText: moneyText,
      };
      this.players.push(p);
      index++;
    }
  }

  draw(x, y) {
    this.leaderboardContainer.x = x;
    this.leaderboardContainer.y = y;

    const container = new PIXI.Container();

    this.leaderboardText = new PIXI.Text('Players:', {
      fontFamily: 'Arial',
      fontSize: 35,
      fontWeight: 'bold',
      fill: 0x000000,
      align: 'center',
    });
    this.leaderboardText.x = 0;
    this.leaderboardText.y = 0;

    this.currentPlayerIndicator = PIXI.Sprite.from('src/assets/right_arrows.png');
    this.currentPlayerIndicator.scale.x = 0.25;
    this.currentPlayerIndicator.scale.y = 0.25;
    this.currentPlayerIndicator.x = 0;
    this.currentPlayerIndicator.y = 0;
    this.currentPlayerIndicator.pivot.x = this.currentPlayerIndicator.width / 2;
    this.currentPlayerIndicator.pivot.y = this.currentPlayerIndicator.height / 2;

    this.currentPlayerIndicator2 = PIXI.Sprite.from('src/assets/right_arrows.png');
    this.currentPlayerIndicator2.scale.x = 0.4;
    this.currentPlayerIndicator2.scale.y = 0.4;
    this.currentPlayerIndicator2.pivot.x = this.currentPlayerIndicator2.width / 2;
    this.currentPlayerIndicator2.pivot.y = this.currentPlayerIndicator2.height / 2;
    this.currentPlayerIndicator2.alpha = 0.7;

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

    this.playerMoney = new PIXI.Text('', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0x000000,
      align: 'center',
    });
    this.playerMoney.x = 10 + this.playerNames.width;
    this.playerMoney.y = this.leaderboardText.height;

    this.playerPosLine = new PIXI.Graphics();
    this.playerPosLine.visible = false;

    container.addChild(
      this.leaderboardText,
      this.currentPlayerIndicator,
      this.currentPlayerIndicator2,
      this.playerNames,
      this.playerMoney,
      this.playerPosLine,
    );
    this.leaderboardContainer.addChild(container);
  }
}

