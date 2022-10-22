export class Chance {
  constructor() {
    this.name = 'Chance';
  }

  onEnter(stateMachine, gameState) {
    console.log('Chance');
    this.gameState = gameState;

    if (this.gameState.doubleDiceRoll) {
      stateMachine.setState('TurnStart', gameState);
      return;
    }

    stateMachine.setState('TurnEnd', gameState);
  }

  onExit() {
    console.log('Chance exit');
  }
}
