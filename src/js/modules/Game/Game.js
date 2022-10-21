import { GameState } from './GameState.js';

export class Game {
  constructor() {
    this.gameState = new GameState();

    this.stateMachine = new StateMachine();
    this.stateMachine.addState(new TurnStart());
    this.stateMachine.addState(new TurnEnd());
    this.stateMachine.addState(
      new Property('Mediterranean Avenue', 0x00ff00, 60, [2, 10, 30, 90, 160, 250], 30, 50, 50)
    );
    this.stateMachine.addState(
      new Property('Baltic Avenue', 0x00ff00, 60, [4, 20, 60, 180, 320, 450], 30, 50, 50)
    );
    this.stateMachine.addState(
      new Property('Oriental Avenue', 0x0000ff, 100, [6, 30, 90, 270, 400, 550], 50, 50, 50)
    );
    this.stateMachine.addState(new Go());

    this.stateMachine.setState('TurnStart');
  }

  rollDice(dice1Override, dice2Override) {
    if (this.stateMachine.currentState.name !== 'TurnStart') {
      throw new Error('Cannot roll dice outside of TurnStart state');
    }

    const nextState = this.stateMachine.currentState.rollDice(dice1Override, dice2Override);
    this.stateMachine.setState(nextState);
  }

  endTurn() {
    if (this.stateMachine.currentState.name !== 'TurnEnd') {
      throw new Error('Cannot end turn outside of TurnEnd state');
    }

    this.stateMachine.setState('TurnStart');
  }
}
