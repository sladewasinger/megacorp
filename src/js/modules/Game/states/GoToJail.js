export class GoToJail {
  constructor() {
    this.name = 'Go To Jail';
  }

  onEnter(stateMachine, gameState) {
    console.log('Go To Jail');
    this.gameState = gameState;

    this.gameState.currentPlayer.inJail = true;
    this.gameState.currentPlayer.jailTurns = 3;
    this.gameState.currentPlayer.prevPosition = this.gameState.currentPlayer.position;
    this.gameState.currentPlayer.position = 10;
    // get all positions between prev position and current position
    const positions = [this.gameState.currentPlayer.prevPosition, this.gameState.currentPlayer.position];
    stateMachine.playerMovementCallbackFn(this.gameState.currentPlayer, positions);

    stateMachine.setState('Jail', this.gameState);
  }

  onExit() {
    console.log('GoToJail exit');
  }
}
