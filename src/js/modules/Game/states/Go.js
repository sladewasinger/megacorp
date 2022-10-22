export class Go {
  constructor() {
    this.name = 'Go';
    this.gameState = null;
  }

  onEnter(stateMachine, gameState) {
    console.log('Go');
    this.gameState = gameState;
    stateMachine.setState('TurnEnd', gameState);
  }

  onExit() {
    console.log('Go exit');
  }
}
