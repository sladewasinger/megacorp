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

export class Game {
  constructor(players, gameStateUpdatedCallbackFn, playerMovementCallbackFn) {
    this.gameStateUpdatedCallbackFn = gameStateUpdatedCallbackFn || (() => { });
    this.playerMovementCallbackFn = playerMovementCallbackFn || (() => { });

    this.gameState = new GameState();
    this.gameState.players = players;

    this.stateMachine = new StateMachine(this.gameStateUpdatedCallbackFn, this.playerMovementCallbackFn);
    this.stateMachine.addState(new TurnStart());
    this.stateMachine.addState(new TurnEnd());
    this.stateMachine.addState(new JailDecision());
    this.stateMachine.addState(new Go());
    this.stateMachine.addState(
      new Property('Mediterranean Avenue', 0x00ff00, 60, [2, 10, 30, 90, 160, 250], 50, 50),
    );
    this.stateMachine.addState(new CommunityChest());
    this.stateMachine.addState(
      new Property('Baltic Avenue', 0x00ff00, 60, [4, 20, 60, 180, 320, 450], 50, 50),
    );
    this.stateMachine.addState(new IncomeTax());
    this.stateMachine.addState(new Railroad('Reading Railroad', 200));
    this.stateMachine.addState(
      new Property('Oriental Avenue', 0x0000ff, 100, [6, 30, 90, 270, 400, 550], 50, 50),
    );
    this.stateMachine.addState(new Chance());
    this.stateMachine.addState(
      new Property('Vermont Avenue', 0x0000ff, 100, [6, 30, 90, 270, 400, 550], 50, 50),
    );
    this.stateMachine.addState(
      new Property('Connecticut Avenue', 0x0000ff, 120, [8, 40, 100, 300, 450, 600], 50, 50),
    );
    this.stateMachine.addState(new Jail());
    this.stateMachine.addState(
      new Property('St. Charles Place', 0xff0000, 140, [10, 50, 150, 450, 625, 750], 100, 100),
    );
    this.stateMachine.addState(new Property('Electric Company', 0x000000, 150, [4, 10], 75, 75));
    this.stateMachine.addState(
      new Property('States Avenue', 0xff0000, 140, [10, 50, 150, 450, 625, 750], 100, 100),
    );
    this.stateMachine.addState(
      new Property('Virginia Avenue', 0xff0000, 160, [12, 60, 180, 500, 700, 900], 100, 100),
    );
    this.stateMachine.addState(new Railroad('Pennsylvania Railroad', 200));
    this.stateMachine.addState(
      new Property('St. James Place', 0xffff00, 180, [14, 70, 200, 550, 750, 950], 100, 100),
    );
    this.stateMachine.addState(new CommunityChest());
    this.stateMachine.addState(
      new Property('Tennessee Avenue', 0xffff00, 180, [14, 70, 200, 550, 750, 950], 100, 100),
    );
    this.stateMachine.addState(
      new Property('New York Avenue', 0xffff00, 200, [16, 80, 220, 600, 800, 1000], 100, 100),
    );
    this.stateMachine.addState(new FreeParking());
    this.stateMachine.addState(
      new Property('Kentucky Avenue', 0xff00ff, 220, [18, 90, 250, 700, 875, 1050], 150, 150),
    );
    this.stateMachine.addState(new Chance());
    this.stateMachine.addState(
      new Property('Indiana Avenue', 0xff00ff, 220, [18, 90, 250, 700, 875, 1050], 150, 150),
    );
    this.stateMachine.addState(
      new Property('Illinois Avenue', 0xff00ff, 240, [20, 100, 300, 750, 925, 1100], 150, 150),
    );
    this.stateMachine.addState(new Railroad('B. & O. Railroad', 200));
    this.stateMachine.addState(
      new Property('Atlantic Avenue', 0x00ffff, 260, [22, 110, 330, 800, 975, 1150], 150, 150),
    );
    this.stateMachine.addState(
      new Property('Ventnor Avenue', 0x00ffff, 260, [22, 110, 330, 800, 975, 1150], 150, 150),
    );
    this.stateMachine.addState(new Property('Water Works', 0x000000, 150, [4, 10], 75, 75));
    this.stateMachine.addState(
      new Property('Marvin Gardens', 0x00ffff, 280, [24, 120, 360, 850, 1025, 1200], 150, 150),
    );
    this.stateMachine.addState(new GoToJail());
    this.stateMachine.addState(
      new Property('Pacific Avenue', 0x00ff00, 300, [26, 130, 390, 900, 1100, 1275], 200, 200),
    );
    this.stateMachine.addState(
      new Property('North Carolina Avenue', 0x00ff00, 300, [26, 130, 390, 900, 1100, 1275], 200, 200),
    );
    this.stateMachine.addState(new CommunityChest());
    this.stateMachine.addState(
      new Property('Pennsylvania Avenue', 0x00ff00, 320, [28, 150, 450, 1000, 1200, 1400], 200, 200),
    );
    this.stateMachine.addState(new Railroad('Short Line', 200));
    this.stateMachine.addState(new Chance());
    this.stateMachine.addState(
      new Property('Park Place', 0x0000ff, 350, [35, 175, 500, 1100, 1300, 1500], 200, 200),
    );
    this.stateMachine.addState(new LuxuryTax());
    this.stateMachine.addState(
      new Property('Boardwalk', 0x0000ff, 400, [50, 200, 600, 1400, 1700, 2000], 200, 200),
    );

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
          title: tile.title,
          color: tile.color,
          rent: tile.rent,
          mortgage: tile.mortgage,
          houseCost: tile.houseCost,
          houses: tile.houses,
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

    let index = 0;
    for (const player of this.gameState.players) {
      index++;
      player.money = 1500;
      player.prevPosition = -1;
      player.position = 0;
      player.color = hslToHex(selectColor(index));
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

    this.gameState.communityChestDeck.shuffle();
    this.gameState.chanceDeck.shuffle();

    this.stateMachine.setState('TurnStart', this.gameState);
  }

  rollDice(dice1Override, dice2Override) {
    if (this.stateMachine.currentState.name !== 'TurnStart' &&
      this.stateMachine.currentState.name !== 'JailDecision') {
      throw new Error('Cannot roll dice outside of TurnStart/JailDecision state');
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


  endTurn() {
    if (this.stateMachine.currentState.name !== 'TurnEnd') {
      throw new Error(`Cannot end turn outside of TurnEnd state` +
        `current state: '${this.stateMachine.currentState.name}'`);
    }

    // Switch to next player
    this.gameState.players.push(this.gameState.players.shift());

    this.stateMachine.setState('TurnStart', this.gameState);
  }
}
