export class AdvanceToGo {
  constructor() {
    this.name = 'Advance to Go';
    this.type = 'communityChest';
  }

  onDraw(stateMachine, gameState) {
    console.log(`Community Chest: ${this.name}`);
    gameState.currentPlayer.prevPosition = gameState.currentPlayer.position;
    gameState.currentPlayer.position = 0;
    gameState.currentPlayer.directMovement = true;
    gameState.communityChestMessage = 'Advance to Go';

    const positions = [gameState.currentPlayer.prevPosition, gameState.currentPlayer.position];
    stateMachine.playerMovementCallbackFn(gameState.currentPlayer, positions);
  }
}
