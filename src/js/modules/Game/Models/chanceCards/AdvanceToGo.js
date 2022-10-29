export class AdvanceToGo {
  constructor() {
    this.name = 'Advance to Go';
    this.type = 'chance';
    this.msg = 'Collect $200';
  }

  onDraw(stateMachine, gameState) {
    super.onDraw(stateMachine, gameState);

    gameState.currentPlayer.prevPosition = gameState.currentPlayer.position;
    gameState.currentPlayer.position = 0;
    gameState.currentPlayer.directMovement = true;

    const positions = [gameState.currentPlayer.prevPosition, gameState.currentPlayer.position];
    stateMachine.playerMovementCallbackFn(gameState.currentPlayer, positions);

    return 'Go';
  }
}
