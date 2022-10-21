export class AdvanceToGo {
  constructor() {
    this.name = 'Advance to Go';
  }

  onDraw(gameState) {
    gameState.currentPlayer.position = 0;
    gameState.communityChestMessage = 'Advance to Go';
  }
}
