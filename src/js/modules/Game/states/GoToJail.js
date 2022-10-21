export class GoToJail {
  constructor() {
    this.name = 'Go To Jail';
  }

  onEnter(stateMachine, gameState) {
    console.log('Go To Jail');
    this.gameState = gameState;

    this.gameState.currentPlayer.inJail = true;
    this.gameState.currentPlayer.jailTurns = 3;
    this.gameState.currentPlayer.position = 10;
    stateMachine.setState('Jail', this.gameState);
  }

  onExit() {
    console.log('GoToJail exit');
  }
}
