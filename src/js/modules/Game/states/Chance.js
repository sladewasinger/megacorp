export class Chance {
  constructor() {
    this.name = 'Chance';
  }

  onEnter(stateMachine, gameState) {
    console.log('Chance');
    this.gameState = gameState;

    stateMachine.setState('TurnEnd', gameState);
  }

  onExit() {
    console.log('Chance exit');
  }
}
