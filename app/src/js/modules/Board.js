import { ColorTile } from './Tiles/ColorTile.js';
import { FreeParkingTile } from './Tiles/FreeParkingTile.js';
import { GoTile } from './Tiles/GoTile.js';
import { JailTile } from './Tiles/JailTile.js';
import { GoToJailTile } from './Tiles/GoToJailTile.js';
import { RailroadTile } from './Tiles/RailroadTile.js';
import { Dice } from './Dice.js';
import { Buttons } from './Buttons.js';
import { CommunityChestTile } from './Tiles/CommunityChestTile.js';
import { ChanceTile } from './Tiles/ChanceTile.js';
import { Leaderboard } from './Leaderboard.js';
import { CommunityChest } from './CommunityChest.js';
import { BidButtons } from './BidButtons.js';
import { TopAnimations } from './TopAnimations.js';
import { BottomAnimations } from './BottomAnimations.js';
import { TaxTile } from './Tiles/TaxTile.js';
import { ElectricCompany } from './Tiles/ElectricCompany.js';
import { WaterWorksTile } from './Tiles/WaterWorksTile.js';
const PIXI = window.PIXI;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const calcDistance = (x1, y1, x2, y2) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

export class Board {
  constructor(
    canvas,
    container,
    rollDiceCallback,
    buyPropertyCallback,
    auctionPropertyCallback,
    endTurnCallback,
    bidCallback,
    mortgageCallback,
  ) {
    this.canvas = canvas;
    this.container = container;
    this.rollDiceCallback = rollDiceCallback;
    this.buyPropertyCallback = buyPropertyCallback;
    this.auctionPropertyCallback = auctionPropertyCallback;
    this.bidCallback = bidCallback;
    this.endTurnCallback = endTurnCallback;
    this.dice = null;

    this.renderState = {
      animationInProgress: false,
      time: 0,
      mortgageCallback: mortgageCallback,
    };
    setInterval(() => {
      this.renderState.time++;
    }, 10);

    this.width = 1200;
    this.height = 1200;
    this.tiles = [];
    this.players = null;
    this.prevGameState = null;

    this.boardContainer = new PIXI.Container();
    this.boardContainer.width = this.width;
    this.boardContainer.height = this.height;
    this.container.addChild(this.boardContainer);

    window.addEventListener('resize', this.resize.bind(this));
  }

  async update(gameState) {
    if (!gameState) {
      console.log('game state is null');
      return;
    }
    this.gameState = gameState;

    this.tiles.forEach((tile, index) => {
      tile.update(index, gameState, this.renderState);
    });

    if (!this.players) {
      this.drawPlayersInitial(gameState);
      for (const gamePlayer of gameState.players) {
        // this.drawPlayerMoveAnimation(gameState, gamePlayer.id, -1, gamePlayer.position);
        this.drawPlayerMovement(gameState, gamePlayer.id, [0]);
      }
    }

    if (
      gameState.state.name === 'RollDice' &&
      !this.renderState.animationInProgress &&
      !this.renderState.playerMovementInProgress
    ) {
      if (
        gameState.prevState.type === 'property'
      ) {
        this.leaderboard.setMoneyText(gameState);
      }
    }

    // Set controls:
    this.buttons.update(gameState, this.renderState);
    this.dice.update(gameState, this.renderState);
    this.bidButtons.update(gameState, this.renderState, this.tiles);

    // stats:
    this.leaderboard.update(gameState, this.renderState, this.players);
    this.communityChestCard.update(gameState, this.renderState);

    // various animations:
    this.bottomAnimations.update(gameState, this.renderState, this.tiles);
    this.topAnimations.update(gameState, this.renderState, this.tiles);
  }

  async drawPlayerMovement(gameState, playerId, positions) {
    console.log('drawPlayerMovement', playerId, positions);
    if (!gameState) {
      console.error('gameState is null');
      return;
    }

    while (this.renderState.playerMovementInProgress) {
      await sleep(100);
    }

    this.renderState.playerMovementInProgress = true;

    try {
      const playerGraphics = this.players.find((player) => player.id === playerId);
      let lastPosition = positions[0] - 1;
      for (const position of positions) {
        if (Math.abs(position - lastPosition) > 1 && !(lastPosition == 39 && position == 0)) {
          // Big movement - delay so people can see it
          await sleep(1000);
        }
        lastPosition = position;
        const tile = this.tiles.find((t, i) => i === position);
        if (!tile) {
          console.error('could not find tile matching position ', position);
          return;
        }
        const gameTile = gameState.tiles.find((t, i) => i === position);

        // Land on tile:
        if (
          positions.indexOf(position) == positions.length - 1 ||
          position == 0 // Pass GO
        ) {
          if (gameTile.type == 'Community Chest') {
            this.communityChestCard.setVisible();
          }
          this.leaderboard.setMoneyText(this.gameState);
        }

        const targetPos = {
          x: tile.tileContainer.x,
          y: tile.tileContainer.y,
        };

        if (position == 10) {
          // using this.gameState instead of gameState will get current global state
          const currentGamePlayer = this.gameState.players.find((player) => player.id === playerId);
          if (!currentGamePlayer.inJail) {
            targetPos.x -= 40;
            targetPos.y += 40;
          } else {
            targetPos.x += 10;
            targetPos.y -= 20;
          }
        }

        let counter = 0;
        const maxSpeed = 10;
        const damping = 0.15;
        while (
          calcDistance(playerGraphics.x, playerGraphics.y, targetPos.x, targetPos.y) > 2 &&
          counter < 200 // 2 second max of animation (per tile)
        ) {
          counter++;
          const vect = {
            x: targetPos.x - playerGraphics.x,
            y: targetPos.y - playerGraphics.y,
          };
          const dist = calcDistance(0, 0, vect.x, vect.y); // magnitude
          vect.x /= dist;
          vect.y /= dist;
          vect.x *= Math.min(maxSpeed, dist * damping);
          vect.y *= Math.min(maxSpeed, dist * damping);
          playerGraphics.x += vect.x;
          playerGraphics.y += vect.y;
          await sleep(10);
        }

        // set to exact position:
        playerGraphics.x = targetPos.x;
        playerGraphics.y = targetPos.y;

        const playersOnSameTile = gameState.players
          .filter((p) => p.id != playerId)
          .filter((p) => p.position === position);
        if (playersOnSameTile.length > 0) {
          // const playerIndex = playersOnSameTile.findIndex((p) => p.id === gamePlayer.id);
          const offset = Math.random() * 50 - 25;
          playerGraphics.x += offset;
          playerGraphics.y += offset;
        }
      }
    } catch (e) {
      console.error(e);
    }

    this.renderState.playerMovementInProgress = false;
  }

  drawPlayersInitial(gameState) {
    console.log('drawPlayersInitial');
    this.players = [];
    gameState.players.forEach((player) => {
      const playerContainer = new PIXI.Container();
      playerContainer.id = player.id;
      // playerContainer.zIndex = 1000;
      playerContainer.x = this.width;
      playerContainer.y = this.height;

      const graphics = new PIXI.Graphics();
      graphics.beginFill(player.color);
      graphics.lineStyle(2, 0x000000, 1);
      graphics.drawCircle(0, 0, 15);
      graphics.endFill();
      // graphics.zIndex = 1001;

      playerContainer.addChild(graphics);
      this.players.push(playerContainer);
      this.boardContainer.addChild(playerContainer);
    });
  }

  resize(e) {
    const scale = Math.min(this.canvas.width / this.width, this.canvas.height / this.height);
    this.boardContainer.scale.x = scale;
    this.boardContainer.scale.y = scale;
  }

  draw() {
    console.log('drawing board');
    try {
      this.resize();

      this.board = new PIXI.Graphics();
      this.board.beginFill(0xcde6d0);
      this.board.lineStyle(2, 0xff0000, 1);
      this.board.drawRect(0, 0, this.width, this.height);
      this.board.endFill();
      this.boardContainer.addChild(this.board);

      this.bottomAnimations = new BottomAnimations(this.boardContainer, this.width, this.height);
      this.bottomAnimations.draw();

      const title = new PIXI.Text('Megacorp', {
        fontFamily: 'Arial',
        fontSize: 48,
        fill: 0x000000,
        align: 'center',
        wordWrap: true,
        wordWrapWidth: this.width,
      });
      title.pivot.x = title.width / 2;
      title.x = this.width / 2;
      title.y = this.height / 2 - title.height / 2;
      title.visible = false;
      this.boardContainer.addChild(title);

      // ********************************************* //
      // Controls:
      this.dice = new Dice(this.boardContainer, this.rollDiceCallback);
      this.dice.draw();
      this.dice.setPosition(200, this.height - 250);

      const buttonsContainer1 = new PIXI.Container();
      this.boardContainer.addChild(buttonsContainer1);
      this.buttons = new Buttons(
        buttonsContainer1,
        this.buyPropertyCallback,
        this.auctionPropertyCallback,
        this.endTurnCallback,
      );
      this.buttons.draw();
      this.buttons.setPosition(200, this.height - 310);

      const bidButtonsContainer = new PIXI.Container();
      this.bidButtons = new BidButtons(bidButtonsContainer, this.bidCallback);
      this.bidButtons.draw(200, this.height - 460);
      this.boardContainer.addChild(bidButtonsContainer);

      // ********************************************* //
      // CommunityChest + Chance:
      this.communityChestCard = new CommunityChest(this.boardContainer);
      this.communityChestCard.draw(this.width - 150 - this.communityChestCard.width, 150 + 10);

      // ********************************************* //
      // Tiles:
      this.goTile = new GoTile();
      this.goTile.draw(this.boardContainer, this.width - 75, this.height - 75);

      this.mediterraneanAvenue = new ColorTile(
        'Mediterranean Avenue',
        0x955436,
        60,
      );
      this.mediterraneanAvenue.draw(
        this.boardContainer,
        this.width - 100 - 100,
        this.height - 75,
      );

      this.communityChest1 = new CommunityChestTile();
      this.communityChest1.draw(
        this.boardContainer,
        this.width - 100 - 100 - 100,
        this.height - 75,
      );

      this.balticAvenue = new ColorTile('Baltic Avenue', 0x955436, 60);
      this.balticAvenue.draw(
        this.boardContainer,
        this.width - 100 - 100 - 100 - 100,
        this.height - 75,
      );

      this.incomeTax = new TaxTile('Income Tax');
      this.incomeTax.draw(this.boardContainer, this.width - 100 - 100 * 4, this.height - 75);

      this.readingRailroad = new RailroadTile(
        'Reading Railroad',
        0x000000,
        200,
      );
      this.readingRailroad.draw(
        this.boardContainer,
        this.width - 100 - 100 * 5,
        this.height - 75,
      );

      this.orientalAvenue = new ColorTile('Oriental Avenue', 0xace2fc, 100);
      this.orientalAvenue.draw(
        this.boardContainer,
        this.width - 100 - 100 * 6,
        this.height - 75,
      );

      this.chance1 = new ChanceTile();
      this.chance1.draw(this.boardContainer, this.width - 100 - 100 * 7, this.height - 75);

      this.vermontAvenue = new ColorTile('Vermont Avenue', 0xace2fc, 100);
      this.vermontAvenue.draw(
        this.boardContainer,
        this.width - 100 - 100 * 8,
        this.height - 75,
      );

      this.connecticutAvenue = new ColorTile(
        'Connecticut Avenue',
        0xace2fc,
        120,
      );
      this.connecticutAvenue.draw(
        this.boardContainer,
        this.width - 100 - 100 * 9,
        this.height - 75,
      );

      this.jail = new JailTile('Jail', 0x000000, 0);
      this.jail.draw(this.boardContainer, 75, this.height - 75);

      this.stCharlesPlace = new ColorTile('St. Charles Place', 0xd93a96, 140);
      this.stCharlesPlace.draw(
        this.boardContainer,
        75,
        this.height - 200,
        Math.PI / 2,
      );

      this.electricCompany = new ElectricCompany();
      this.electricCompany.draw(
        this.boardContainer,
        75,
        this.height - 200 - 100,
        Math.PI / 2,
      );

      this.statesAvenue = new ColorTile('States Avenue', 0xd93a96, 140);
      this.statesAvenue.draw(
        this.boardContainer,
        75,
        this.height - 200 - 100 * 2,
        Math.PI / 2,
      );

      this.virginiaAvenue = new ColorTile('Virginia Avenue', 0xd93a96, 160);
      this.virginiaAvenue.draw(
        this.boardContainer,
        75,
        this.height - 200 - 100 * 3,
        Math.PI / 2,
      );

      this.pennsylvaniaRailroad = new RailroadTile(
        'Pennsylvania Railroad',
        0x000000,
        200,
      );
      this.pennsylvaniaRailroad.draw(
        this.boardContainer,
        75,
        this.height - 200 - 100 * 4,
        Math.PI / 2,
      );

      this.stJamesPlace = new ColorTile('St. James Place', 0xf7941d, 180);
      this.stJamesPlace.draw(
        this.boardContainer,
        75,
        this.height - 200 - 100 * 5,
        Math.PI / 2,
      );

      this.communityChest2 = new CommunityChestTile();
      this.communityChest2.draw(
        this.boardContainer,
        75,
        this.height - 200 - 100 * 6,
        Math.PI / 2,
      );

      this.tennesseeAvenue = new ColorTile('Tennessee Avenue', 0xf7941d, 180);
      this.tennesseeAvenue.draw(
        this.boardContainer,
        75,
        this.height - 200 - 100 * 7,
        Math.PI / 2,
      );

      this.newYorkAvenue = new ColorTile('New York Avenue', 0xf7941d, 200);
      this.newYorkAvenue.draw(
        this.boardContainer,
        75,
        this.height - 200 - 100 * 8,
        Math.PI / 2,
      );

      this.freeParking = new FreeParkingTile('Free Parking', 0x000000, 0);
      this.freeParking.draw(this.boardContainer, 75, 75);

      this.kentuckyAvenue = new ColorTile('Kentucky Avenue', 0xed1b24, 220);
      this.kentuckyAvenue.draw(this.boardContainer, 200, 75, 0);

      this.chance2 = new ChanceTile();
      this.chance2.draw(this.boardContainer, 200 + 100, 75, 0);

      this.indianaAvenue = new ColorTile('Indiana Avenue', 0xed1b24, 220);
      this.indianaAvenue.draw(this.boardContainer, 200 + 100 * 2, 75, 0);

      this.illinoisAvenue = new ColorTile('Illinois Avenue', 0xed1b24, 240);
      this.illinoisAvenue.draw(this.boardContainer, 200 + 100 * 3, 75, 0);

      this.bAndORailroad = new RailroadTile('B & O Railroad', 0x000000, 200);
      this.bAndORailroad.draw(this.boardContainer, 200 + 100 * 4, 75, 0);

      this.atlanticAvenue = new ColorTile('Atlantic Avenue', 0xfef200, 260);
      this.atlanticAvenue.draw(this.boardContainer, 200 + 100 * 5, 75, 0);

      this.ventnorAvenue = new ColorTile('Ventnor Avenue', 0xfef200, 260);
      this.ventnorAvenue.draw(this.boardContainer, 200 + 100 * 6, 75, 0);

      this.waterWorks = new WaterWorksTile();
      this.waterWorks.draw(this.boardContainer, 200 + 100 * 7, 75, 0);

      this.marvinGardens = new ColorTile('Marvin Gardens', 0xfef200, 280);
      this.marvinGardens.draw(this.boardContainer, 200 + 100 * 8, 75, 0);

      this.goToJail = new GoToJailTile('Go To Jail', 0x000000, 0);
      this.goToJail.draw(this.boardContainer, this.width - 75, 75, 0);

      this.pacificAvenue = new ColorTile('Pacific Avenue', 0x1fb25a, 300);
      this.pacificAvenue.draw(
        this.boardContainer,
        this.width - 75,
        200,
        -Math.PI / 2,
      );

      this.northCarolinaAvenue = new ColorTile(
        'North Carolina Avenue',
        0x1fb25a,
        300,
      );
      this.northCarolinaAvenue.draw(
        this.boardContainer,
        this.width - 75,
        200 + 100,
        -Math.PI / 2,
      );

      this.communityChest3 = new CommunityChestTile();
      this.communityChest3.draw(
        this.boardContainer,
        this.width - 75,
        200 + 100 * 2,
        -Math.PI / 2,
      );

      this.pennsylvaniaAvenue = new ColorTile(
        'Pennsylvania Avenue',
        0x1fb25a,
        320,
      );
      this.pennsylvaniaAvenue.draw(
        this.boardContainer,
        this.width - 75,
        200 + 100 * 3,
        -Math.PI / 2,
      );

      this.shortLine = new RailroadTile('Short Line', 0x000000, 200);
      this.shortLine.draw(
        this.boardContainer,
        this.width - 75,
        200 + 100 * 4,
        -Math.PI / 2,
      );

      this.chance3 = new ChanceTile();
      this.chance3.draw(
        this.boardContainer,
        this.width - 75,
        200 + 100 * 5,
        -Math.PI / 2,
      );

      this.parkPlace = new ColorTile('Park Place', 0x0072bb, 350);
      this.parkPlace.draw(
        this.boardContainer,
        this.width - 75,
        200 + 100 * 6,
        -Math.PI / 2,
      );

      this.luxuryTax = new TaxTile('Luxury Tax', 0x000000, 0);
      this.luxuryTax.draw(
        this.boardContainer,
        this.width - 75,
        200 + 100 * 7,
        -Math.PI / 2,
      );

      this.boardwalk = new ColorTile('Boardwalk', 0x0072bb, 400);
      this.boardwalk.draw(
        this.boardContainer,
        this.width - 75,
        200 + 100 * 8,
        -Math.PI / 2,
      );

      // ********************************************* //
      // Leaderboard
      const leaderBoardContainer = new PIXI.Container();
      this.boardContainer.addChild(leaderBoardContainer);
      this.leaderboard = new Leaderboard(leaderBoardContainer);
      this.leaderboard.draw(150 + 100, 150 + 50);

      // ********************************************* //
      // Animations:
      this.topAnimations = new TopAnimations(this.boardContainer, this.width, this.height);
      this.topAnimations.draw();

      // ********************************************* //

      this.tiles = [
        this.goTile,
        this.mediterraneanAvenue,
        this.communityChest1,
        this.balticAvenue,
        this.incomeTax,
        this.readingRailroad,
        this.orientalAvenue,
        this.chance1,
        this.vermontAvenue,
        this.connecticutAvenue,
        this.jail,
        this.stCharlesPlace,
        this.electricCompany,
        this.statesAvenue,
        this.virginiaAvenue,
        this.pennsylvaniaRailroad,
        this.stJamesPlace,
        this.communityChest2,
        this.tennesseeAvenue,
        this.newYorkAvenue,
        this.freeParking,
        this.kentuckyAvenue,
        this.chance2,
        this.indianaAvenue,
        this.illinoisAvenue,
        this.bAndORailroad,
        this.atlanticAvenue,
        this.ventnorAvenue,
        this.waterWorks,
        this.marvinGardens,
        this.goToJail,
        this.pacificAvenue,
        this.northCarolinaAvenue,
        this.communityChest3,
        this.pennsylvaniaAvenue,
        this.shortLine,
        this.chance3,
        this.parkPlace,
        this.luxuryTax,
        this.boardwalk,
      ];
    } catch (error) {
      console.log(error);
    }
  }
}
