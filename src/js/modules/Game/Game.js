import { GameState } from './States/GameState.js';
import { StateMachine } from './StateMachine.js';
import { TurnStart } from './States/TurnStart.js';
import { TurnEnd } from './States/TurnEnd.js';
import { Go } from './States/Go.js';
import { Property } from './States/Property.js';
import { CommunityChest } from './States/CommunityChest.js';
import { IncomeTax } from './States/IncomeTax.js';
import { Railroad } from './Railroad.js';
import { Chance } from './States/Chance.js';
import { Jail } from './States/Jail.js';
import { FreeParking } from './States/FreeParking.js';
import { GoToJail } from './States/GoToJail.js';
import { LuxuryTax } from './States/LuxuryTax.js';

export class Game {
  constructor(players) {
    this.gameState = new GameState();
    this.gameState.players = players;

    this.stateMachine = new StateMachine();
    this.stateMachine.addState(new TurnStart());
    this.stateMachine.addState(new TurnEnd());
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
    this.stateMachine.addState(new Railroad('B&O Railroad', 200));
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

  rollDice(dice1Override, dice2Override) {
    if (this.stateMachine.currentState.name !== 'TurnStart') {
      throw new Error('Cannot roll dice outside of TurnStart state');
    }

    const nextState = this.stateMachine.currentState.rollDice(dice1Override, dice2Override);
    this.stateMachine.setState(nextState, this.gameState);
  }

  buyProperty() {
    if (this.stateMachine.currentState.type !== 'property') {
      throw new Error('Cannot buy property outside of Property state');
    }

    const nextState = this.stateMachine.currentState.buyProperty(this.gameState);
    this.stateMachine.setState(nextState, this.gameState);
  }


  endTurn() {
    if (this.stateMachine.currentState.name !== 'TurnEnd') {
      throw new Error('Cannot end turn outside of TurnEnd state');
    }

    // Switch to next player
    this.gameState.players.push(this.gameState.players.shift());

    this.stateMachine.setState('TurnStart', this.gameState);
  }
}
