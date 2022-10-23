export class IncomeTax {
  constructor() {
    this.name = 'Income Tax';
    this.type = 'tax';
  }

  onEnter(stateMachine, gameState) {
    console.log('Income Tax');
    this.gameState = gameState;
    this.stateMachine = stateMachine;

    this.gameState.currentPlayer.money -= 200;

    stateMachine.setState('TurnEnd', this.gameState);
  }

  onExit() {
    console.log('IncomeTax exit');
  }
}
