import { GameState } from './states/GameState.js';
import { StateMachine } from './StateMachine.js';
import { TurnStart } from './states/TurnStart.js';
import { TurnEnd } from './states/TurnEnd.js';
import { Go } from './states/Go.js';
import { Property } from './states/Property.js';
import { CommunityChest } from './states/CommunityChest.js';
import { IncomeTax } from './states/IncomeTax.js';
import { Railroad } from './states/Railroad.js';
import { Chance } from './states/Chance.js';
import { Jail } from './states/Jail.js';
import { FreeParking } from './states/FreeParking.js';
import { GoToJail } from './states/GoToJail.js';
import { LuxuryTax } from './states/LuxuryTax.js';
import { Player } from './models/Player.js';
import { JailDecision } from './states/JailDecision.js';
import { RollDiceState } from './states/RollDiceState.js';
import { Auction } from './states/Auction.js';
import { EndAuction } from './states/EndAuction.js';
import { GameOver } from './states/GameOver.js';
import { Bankruptcy } from './states/Bankruptcy.js';
import { randomUUID } from 'crypto';
import { PlayerUtils } from '../utils/PlayerUtils.js';

export class Game {
  constructor(
    players,
    gameStateUpdatedCallbackFn,
    playerMovementCallbackFn,
    landOnTileCallbackFn,
    boughtPropertyCallbackFn,
  ) {
    this.gameStateUpdatedCallbackFn = gameStateUpdatedCallbackFn || (() => { });
    this.playerMovementCallbackFn = playerMovementCallbackFn || (() => { });
    this.landOnTileCallbackFn = landOnTileCallbackFn || (() => { });
    this.boughtPropertyCallbackFn = boughtPropertyCallbackFn || (() => { });

    this.gameState = new GameState();
    this.gameState.players = players;

    this.stateMachine = new StateMachine(this.gameStateUpdatedCallbackFn,
      this.playerMovementCallbackFn, this.landOnTileCallbackFn, this.boughtPropertyCallbackFn);

    this.addGameStates();

    this.stateMachine.setState('TurnStart', this.gameState);
  }

  static createPlayer(id, name) {
    return new Player(id, name);
  }

  getClientGameState(user) {
    const gameState = {
      ...this.gameState,
      chanceDeck: undefined,
      communityChestDeck: undefined,
      stateMachine: undefined,
      tiles: this.gameState.tiles
        .map((tile) => this.stateMachine.states[tile])
        .map((tile) => ({
          id: tile.id,
          name: tile.name,
          title: tile.title,
          color: tile.color,
          rent: tile.rent,
          rents: tile.rents,
          mortgage: tile.mortgage,
          houseCost: tile.houseCost,
          houses: tile.houses,
          hotel: tile.hotel,
          owner: tile.owner,
          mortgaged: tile.mortgaged,
          type: tile.type,
        })),
      state: {
        ...this.stateMachine.currentState,
        stateMachine: undefined,
        gameState: undefined,
      },
      prevState: {
        ...this.stateMachine.previousState,
        stateMachine: undefined,
        gameState: undefined,
      },
      currentPlayer: this.gameState.currentPlayer,
      myId: user.id,
    };
    return gameState;
  }

  startGame(shufflePlayers = false) {
    const selectColor = (number) => {
      const hue = number * 137.508; // use golden angle approximation
      return [hue, 100, 60];
    };
    const hslToHex = ([h, s, l]) => {
      l /= 100;
      const a = s * Math.min(l, 1 - l) / 100;
      const f = (n) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0'); // convert to Hex and prefix "0" if needed
      };
      return +(`0x${f(0)}${f(8)}${f(4)}`);
    };

    const colors = [
      0xe6194B, // red
      0x3cb44b, // green
      0xffe119, // yellow
      0x4363d8, // blue
      0xf58231, // orange
      0x911eb4, // purple
      0x42d4f4, // cyan
      0xf032e6, // magenta
      0xbfef45, // lime
      0xfabeb4, // pink
      0x469990, // teal
      0xdcbeff, // lavender
      0x9A6324, // brown
      0x800000, // maroon
      0xaaffc3, // mint
      0x808000, // olive
      0xffd8b1, // beige
      0x000075, // navy
      0xa9a9a9, // grey
      0xfffac8, // cream
    ];

    let index = 0;
    for (const player of this.gameState.players) {
      player.money = 1500;
      player.prevPosition = -1;
      player.position = 0;
      if (index >= colors.length) {
        player.color = hslToHex(selectColor(index)); // infinite colors
      } else {
        player.color = colors[index]; // limited colors for better contrast
      }
      index++;
      console.log(player.color);
    }

    if (shufflePlayers) {
      // shuffle players
      for (let i = this.gameState.players.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.gameState.players[i], this.gameState.players[j]] = [
          this.gameState.players[j],
          this.gameState.players[i],
        ];
      }
    }

    for (let i = 0; i < this.gameState.players.length; i++) {
      this.gameState.players[i].turnOrder = i;
    }

    // this.gameState.communityChestDeck.shuffle();
    // this.gameState.chanceDeck.shuffle();

    this.stateMachine.setState('TurnStart', this.gameState);
  }

  rollDice(dice1Override, dice2Override) {
    if (this.stateMachine.currentState.name !== 'RollDice' &&
      this.stateMachine.currentState.name !== 'JailDecision') {
      throw new Error('Cannot roll dice outside of RollDice/JailDecision state');
    }

    const nextState = this.stateMachine.currentState.rollDice(dice1Override, dice2Override);
    this.stateMachine.setState(nextState, this.gameState);
  }

  buyProperty() {
    if (this.stateMachine.currentState.type !== 'property') {
      throw new Error('Cannot buy property outside of Property state');
    }
    if (this.stateMachine.currentState.owner) {
      throw new Error('Cannot buy property that is already owned');
    }

    const nextState = this.stateMachine.currentState.buyProperty(this.gameState);
    this.stateMachine.setState(nextState, this.gameState);
  }

  auctionProperty() {
    if (this.stateMachine.currentState.type !== 'property') {
      throw new Error('Cannot auction property outside of Property state');
    }
    if (this.stateMachine.currentState.owner) {
      throw new Error('Cannot auction property that is already owned');
    }

    const nextState = this.stateMachine.currentState.auctionProperty(this.gameState);
    this.stateMachine.setState(nextState, this.gameState);
  }

  bid(playerId, bidAmount) {
    if (this.stateMachine.currentState.name !== 'Auction') {
      throw new Error('Cannot bid outside of Auction state');
    }
    if (this.stateMachine.currentState.auction?.bids.some((bid) => bid.playerId === playerId)) {
      throw new Error('Cannot bid twice');
    }

    const nextState = this.stateMachine.currentState.bid(playerId, bidAmount);
    this.stateMachine.setState(nextState, this.gameState);
  }

  endTurn() {
    if (this.stateMachine.currentState.name !== 'TurnEnd') {
      throw new Error(`Cannot end turn outside of TurnEnd state! ` +
        `Current state: '${this.stateMachine.currentState.name}'`);
    }

    // Switch to next player
    let currentPlayer;
    let count = 0;
    do {
      currentPlayer = this.gameState.players.shift();
      this.gameState.players.push(currentPlayer);
      count++;
    } while (this.gameState.currentPlayer.money < 0 && count < this.gameState.players.length);

    if (count >= this.gameState.players.length && this.gameState.players.length > 1) {
      this.gameState.winner = this.gameState.currentPlayer;
      this.stateMachine.setState('GameOver', this.gameState);
    }

    if (this.gameState.currentPlayer.money < 0) {
      this.stateMachine.setState('Bankruptcy', this.gameState);
      return;
    }

    this.stateMachine.setState('TurnStart', this.gameState);
  }

  mortgageProperty(player, tileState) {
    if (!tileState.owner) {
      throw new Error('Cannot mortgage property that is not owned!');
    }
    if (tileState.owner !== player) {
      throw new Error('Cannot mortgage property that is not owned by you!');
    }
    if (tileState.type !== 'property') {
      throw new Error('This isn\'t a mortgagable property!');
    }
    if (tileState.mortgaged) {
      throw new Error('This property is already mortgaged!');
    }

    console.log(`Mortgaging property ${tileState.title} for player ${player.name}`);
    tileState.mortgaged = true;
    player.money += tileState.mortgage;
    this.stateMachine.setState('TurnEnd', this.gameState);
  }

  unmortgageProperty(player, tileState) {
    if (!tileState.owner) {
      throw new Error('Cannot mortgage property that is not owned!');
    }
    if (tileState.owner !== player) {
      throw new Error('Cannot mortgage property that is not owned by you!');
    }
    if (tileState.type !== 'property') {
      throw new Error('This isn\'t a mortgagable property!');
    }
    if (!tileState.mortgaged) {
      throw new Error('This property is not mortgaged!');
    }
    if (player.money < Math.floor(tileState.mortgage * 1.1)) {
      throw new Error('You don\'t have enough money to unmortgage this property!');
    }

    console.log(`Unmortgaging property ${tileState.title} for player ${player.name}`);
    tileState.mortgaged = false;
    player.money -= Math.floor(tileState.mortgage * 1.1);
    this.stateMachine.setState('TurnEnd', this.gameState);
  }

  buyHouse(player, tileState) {
    if (!tileState.owner) {
      throw new Error('Cannot mortgage property that is not owned!');
    }
    if (tileState.owner !== player) {
      throw new Error('Cannot mortgage property that is not owned by you!');
    }
    if (tileState.type !== 'property' || tileState.subtype !== 'color') {
      throw new Error('This isn\'t a property!');
    }
    if (tileState.mortgaged) {
      throw new Error('This property is mortgaged!');
    }
    if (tileState.houses >= 4 && tileState.hotel) {
      throw new Error('This property already has 4 houses and a hotel!');
    }
    if (player.money < tileState.houseCost) {
      throw new Error('You don\'t have enough money to buy a house!');
    }
    const coloredTiles = this.stateMachine.getStates()
      .filter((x) => x.subtype == 'color')
      .filter((tile) => tile.color === tileState.color);
    const ownsAllTilesOfSameColor = coloredTiles.every((tile) => tile.owner?.id === player.id);
    if (!ownsAllTilesOfSameColor) {
      throw new Error('You don\'t own all tiles of the same color!');
    }

    console.log(`Buying ${tileState.houses + 1} house on property ${tileState.title} for player ${player.name}`);
    tileState.houses++;
    if (tileState.houses > 4) {
      tileState.hotel = true;
      tileState.houses = 4;
    }
    player.money -= tileState.houseCost;
    this.stateMachine.setState('TurnEnd', this.gameState);
  }

  sellHouse(player, tileState) {
    if (!tileState.owner) {
      throw new Error('Cannot mortgage property that is not owned!');
    }
    if (tileState.owner !== player) {
      throw new Error('Cannot mortgage property that is not owned by you!');
    }
    if (tileState.type !== 'property' || tileState.subtype !== 'color') {
      throw new Error('This isn\'t a property!');
    }
    if (tileState.houses <= 0) {
      throw new Error('This property has 0 houses!');
    }

    console.log(`Selling house on property ${tileState.title} for player ${player.name}`);
    if (tileState.hotel) {
      tileState.hotel = false;
      tileState.houses = 4;
    } else {
      tileState.houses--;
    }
    player.money += tileState.houseCost;
    this.stateMachine.setState('TurnEnd', this.gameState);
  }

  declareBankruptcy() {
    if (this.stateMachine.currentState.name !== 'Bankruptcy') {
      throw new Error('Cannot declare bankruptcy outside of Bankruptcy state');
    }

    console.log(`Player ${this.gameState.currentPlayer.name} declares bankruptcy!`);
    const ownedProperties = this.stateMachine.getStates()
      .filter((x) => x.type == 'property')
      .filter((tile) => tile.owner?.id === this.gameState.currentPlayer.id);
    for (const property of ownedProperties) {
      property.owner = null;
      property.mortgaged = false;
      property.houses = 0;
      property.hotel = false;
    }

    // Switch to next player:
    let currentPlayer;
    let count = 0;
    do {
      currentPlayer = this.gameState.players.shift();
      currentPlayer.bankrupt = true;
      this.gameState.players.push(currentPlayer);
      count++;
    } while (this.gameState.currentPlayer.money < 0 && count < this.gameState.players.length);

    if (count >= this.gameState.players.length - 1) {
      this.gameState.gameOver = true;
      this.gameState.winner = this.gameState.players.find((player) => player.money > 0);

      this.stateMachine.setState('GameOver', this.gameState);
      return;
    }

    this.stateMachine.setState('TurnStart', this.gameState);
  }

  createTrade(player, trade) {
    const otherPlayer = this.gameState.players.find((x) => x.id === trade.targetPlayerId);
    if (!otherPlayer) {
      throw new Error('Target player not found!');
    }
    if (player.id === otherPlayer.id) {
      throw new Error('You can\'t trade with yourself!');
    }
    if (trade.offer.money < 0 || trade.request.money < 0) {
      throw new Error('You can\'t trade negative money!');
    }
    if (trade.offer.money > player.money) {
      throw new Error('You don\'t have enough money to offer!');
    }
    if (trade.request.money > otherPlayer.money) {
      throw new Error('Target player doesn\'t have enough money for your request!');
    }
    const playerOwnedProperties = PlayerUtils.getProperties(player, this.stateMachine, this.gameState);
    for (const offerTile of trade.offer.properties) {
      if (!playerOwnedProperties.find((x) => x.id === offerTile)) {
        throw new Error('You don\'t own this property!');
      }
    }
    const otherPlayerOwnedProperties = PlayerUtils.getProperties(otherPlayer, this.stateMachine, this.gameState);
    for (const requestTile of trade.request.properties) {
      if (!otherPlayerOwnedProperties.find((x) => x.id === requestTile.id)) {
        throw new Error('Target player doesn\'t own this property!');
      }
    }

    console.log(`Player ${player.name} creates trade with player ${otherPlayer.name}`);
    this.gameState.trades = this.gameState.trades || [];
    const newTrade = {
      id: randomUUID(),
      name: `${player.name}`,
      targetPlayerId: trade.targetPlayerId,
      authorPlayerId: player.id,
      offer: {
        money: trade.offer.money,
        properties: this.stateMachine.getStates()
          .filter((x) => x.type == 'property')
          .filter((tile) => trade.offer.properties.includes(tile.id))
          .map((tile) => ({
            id: tile.id,
            name: tile.name,
            color: tile.color,
            title: tile.title,
          })),
      },
      request: {
        money: trade.request.money,
        properties: this.stateMachine.getStates()
          .filter((x) => x.type == 'property')
          .filter((tile) => trade.request.properties.includes(tile.id))
          .map((tile) => ({
            id: tile.id,
            name: tile.name,
            color: tile.color,
            title: tile.title,
          })),
      },
    };
    this.gameState.trades.push(newTrade);

    this.gameStateUpdatedCallbackFn(this.gameState);
  }

  acceptTrade(tradeId) {
    const trade = this.gameState.trades.find((x) => x.id == tradeId);
    if (!trade) {
      throw new Error('Trade not found!');
    }
    const targetPlayer = this.gameState.players.find((x) => x.id === trade.targetPlayerId);
    if (!targetPlayer) {
      throw new Error('Target player not found!');
    }
    const authorPlayer = this.gameState.players.find((x) => x.id === trade.authorPlayerId);
    if (!authorPlayer) {
      throw new Error('Trade author not found!');
    }
    if (targetPlayer.id === authorPlayer.id) {
      throw new Error('You can\'t trade with yourself!');
    }
    if (trade.request.money > targetPlayer.money) {
      throw new Error('You don\'t have enough money for the request!');
    }
    if (trade.offer.money > authorPlayer.money) {
      throw new Error('Target player doesn\'t have enough money for the offer!');
    }
    const playerOwnedProperties = PlayerUtils.getProperties(authorPlayer, this.stateMachine, this.gameState);
    for (const offerTile of trade.offer.properties) {
      if (!playerOwnedProperties.find((x) => x.id === offerTile.id)) {
        throw new Error('Trade author doesn\'t own this property!');
      }
    }
    const targetPlayerOwnedProperties = PlayerUtils.getProperties(targetPlayer, this.stateMachine, this.gameState);
    for (const requestTile of trade.request.properties) {
      if (!targetPlayerOwnedProperties.find((x) => x.id === requestTile.id)) {
        throw new Error('Trade target player doesn\'t own this property!');
      }
    }

    console.log(`Player ${targetPlayer.name} accepts trade with player ${authorPlayer.name}`);
    targetPlayer.money -= +trade.request.money;
    targetPlayer.money += +trade.offer.money;
    authorPlayer.money -= +trade.offer.money;
    authorPlayer.money += +trade.request.money;

    for (const requestTile of trade.request.properties) {
      const tile = this.stateMachine.getStates().find((x) => x.id == requestTile.id);
      tile.owner = authorPlayer;
      authorPlayer.properties.push(tile.name);
    }

    for (const offerTile of trade.offer.properties) {
      const tile = this.stateMachine.getStates().find((x) => x.id == offerTile.id);
      tile.owner = targetPlayer;
      targetPlayer.properties.push(tile.name);
    }

    authorPlayer.properties = this.stateMachine.getStates()
      .filter((x) => x.owner?.id == authorPlayer.id)
      .map((x) => x.name);

    targetPlayer.properties = this.stateMachine.getStates()
      .filter((x) => x.owner?.id == targetPlayer.id)
      .map((x) => x.name);

    this.gameState.trades = this.gameState.trades.filter((x) => x.id !== tradeId);
    this.gameStateUpdatedCallbackFn(this.gameState);
    this.boughtPropertyCallbackFn(this.gameState);
  }

  rejectTrade(tradeId) {
    const trade = this.gameState.trades.find((x) => x.id === tradeId);
    if (!trade) {
      throw new Error('Trade not found!');
    }

    console.log(`Trade ${tradeId} rejected`);
    this.gameState.trades = this.gameState.trades.filter((x) => x.id !== tradeId);
    this.gameStateUpdatedCallbackFn(this.gameState);
  }

  cancelMyTrades(player) {
    console.log(`Player ${player.name} cancels all his trades`);
    this.gameState.trades = this.gameState.trades.filter((x) => x.authorPlayerId !== player.id);
    this.gameStateUpdatedCallbackFn(this.gameState);
  }

  addGameStates() {
    this.stateMachine.addState(new TurnStart());
    this.stateMachine.addState(new TurnEnd());
    this.stateMachine.addState(new RollDiceState());
    this.stateMachine.addState(new JailDecision());
    this.stateMachine.addState(new Auction());
    this.stateMachine.addState(new EndAuction());
    this.stateMachine.addState(new Bankruptcy());
    this.stateMachine.addState(new GameOver());
    this.stateMachine.addState(new Go());
    this.stateMachine.addState(
      new Property('Mediterranean Avenue', 0x955436, 60, [2, 10, 30, 90, 160, 250], 50, 50),
    );
    this.stateMachine.addState(new CommunityChest());
    this.stateMachine.addState(
      new Property('Baltic Avenue', 0x955436, 60, [4, 20, 60, 180, 320, 450], 50, 50),
    );
    this.stateMachine.addState(new IncomeTax());
    this.stateMachine.addState(new Railroad('Reading Railroad', 200));
    this.stateMachine.addState(
      new Property('Oriental Avenue', 0xace2fc, 100, [6, 30, 90, 270, 400, 550], 50, 50),
    );
    this.stateMachine.addState(new Chance());
    this.stateMachine.addState(
      new Property('Vermont Avenue', 0xace2fc, 100, [6, 30, 90, 270, 400, 550], 50, 50),
    );
    this.stateMachine.addState(
      new Property('Connecticut Avenue', 0xace2fc, 120, [8, 40, 100, 300, 450, 600], 50, 50),
    );
    this.stateMachine.addState(new Jail());
    this.stateMachine.addState(
      new Property('St. Charles Place', 0xd93a96, 140, [10, 50, 150, 450, 625, 750], 100, 100),
    );
    this.stateMachine.addState(new Property('Electric Company', 0x000000, 150, [4, 10], 75, 75));
    this.stateMachine.addState(
      new Property('States Avenue', 0xd93a96, 140, [10, 50, 150, 450, 625, 750], 100, 100),
    );
    this.stateMachine.addState(
      new Property('Virginia Avenue', 0xd93a96, 160, [12, 60, 180, 500, 700, 900], 100, 100),
    );
    this.stateMachine.addState(new Railroad('Pennsylvania Railroad', 200));
    this.stateMachine.addState(
      new Property('St. James Place', 0xf7941d, 180, [14, 70, 200, 550, 750, 950], 100, 100),
    );
    this.stateMachine.addState(new CommunityChest());
    this.stateMachine.addState(
      new Property('Tennessee Avenue', 0xf7941d, 180, [14, 70, 200, 550, 750, 950], 100, 100),
    );
    this.stateMachine.addState(
      new Property('New York Avenue', 0xf7941d, 200, [16, 80, 220, 600, 800, 1000], 100, 100),
    );
    this.stateMachine.addState(new FreeParking());
    this.stateMachine.addState(
      new Property('Kentucky Avenue', 0xed1b24, 220, [18, 90, 250, 700, 875, 1050], 150, 150),
    );
    this.stateMachine.addState(new Chance());
    this.stateMachine.addState(
      new Property('Indiana Avenue', 0xed1b24, 220, [18, 90, 250, 700, 875, 1050], 150, 150),
    );
    this.stateMachine.addState(
      new Property('Illinois Avenue', 0xed1b24, 240, [20, 100, 300, 750, 925, 1100], 150, 150),
    );
    this.stateMachine.addState(new Railroad('B. & O. Railroad', 200));
    this.stateMachine.addState(
      new Property('Atlantic Avenue', 0xfef200, 260, [22, 110, 330, 800, 975, 1150], 150, 150),
    );
    this.stateMachine.addState(
      new Property('Ventnor Avenue', 0xfef200, 260, [22, 110, 330, 800, 975, 1150], 150, 150),
    );
    this.stateMachine.addState(new Property('Water Works', 0x000000, 150, [4, 10], 75, 75));
    this.stateMachine.addState(
      new Property('Marvin Gardens', 0xfef200, 280, [24, 120, 360, 850, 1025, 1200], 150, 150),
    );
    this.stateMachine.addState(new GoToJail());
    this.stateMachine.addState(
      new Property('Pacific Avenue', 0x1fb25a, 300, [26, 130, 390, 900, 1100, 1275], 200, 200),
    );
    this.stateMachine.addState(
      new Property('North Carolina Avenue', 0x1fb25a, 300, [26, 130, 390, 900, 1100, 1275], 200, 200),
    );
    this.stateMachine.addState(new CommunityChest());
    this.stateMachine.addState(
      new Property('Pennsylvania Avenue', 0x1fb25a, 320, [28, 150, 450, 1000, 1200, 1400], 200, 200),
    );
    this.stateMachine.addState(new Railroad('Short Line', 200));
    this.stateMachine.addState(new Chance());
    this.stateMachine.addState(
      new Property('Park Place', 0x0072bb, 350, [35, 175, 500, 1100, 1300, 1500], 200, 200),
    );
    this.stateMachine.addState(new LuxuryTax());
    this.stateMachine.addState(
      new Property('Boardwalk', 0x0072bb, 400, [50, 200, 600, 1400, 1700, 2000], 200, 200),
    );
  }
}
