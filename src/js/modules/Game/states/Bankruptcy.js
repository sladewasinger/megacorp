export class Bankruptcy {
  constructor() {
    this.name = 'Bankruptcy';
  }

  onEnter(stateMachine, gameState) {
    console.log(this.name);
    this.gameState = gameState;
    if (gameState.currentPlayer.money > 0) {
      stateMachine.setState('TurnEnd', gameState);
    }
  }

  onExit() {
    console.log(`${this.name} exit`);
  }
}
