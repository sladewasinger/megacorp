export class LuxuryTax {
  constructor() {
    this.name = 'Luxury Tax';
    this.type = 'tax';
  }

  onEnter(stateMachine, gameState) {
    console.log('Luxury Tax');
    this.gameState = gameState;

    this.gameState.currentPlayer.money -= 100;
    stateMachine.setState('TurnEnd', this.gameState);
  }

  onExit() {
    console.log('LuxuryTax exit');
  }
}
