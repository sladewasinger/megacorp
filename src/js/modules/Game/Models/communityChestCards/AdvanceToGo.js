export class AdvanceToGo {
  constructor() {
    this.name = 'Advance to Go';
    this.type = 'communityChest';
  }

  onDraw(gameState) {
    console.log(`Community Chest: ${this.name}`);
    gameState.currentPlayer.position = 0;
    gameState.currentPlayer.directMovement = true;
    gameState.communityChestMessage = 'Advance to Go';
  }
}
