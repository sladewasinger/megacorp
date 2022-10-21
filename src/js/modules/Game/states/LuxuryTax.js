export class LuxuryTax {
  constructor() {
    this.name = 'Luxury Tax';
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
