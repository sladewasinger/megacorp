import { CommunityChestCard } from './CommunityChestCard.js';

export class AdvanceToGo extends CommunityChestCard {
  constructor() {
    super();
    this.name = 'Advance to Go';
    this.type = 'communityChest';
    this.msg = '';
  }

  onDraw(stateMachine, gameState) {
    super.onDraw(stateMachine, gameState);

    gameState.currentPlayer.prevPosition = gameState.currentPlayer.position;
    gameState.currentPlayer.position = 0;
    gameState.currentPlayer.directMovement = true;
    gameState.communityChestMessage = 'Advance to Go';

    const positions = [gameState.currentPlayer.prevPosition, gameState.currentPlayer.position];
    stateMachine.playerMovementCallbackFn(gameState.currentPlayer, positions);

    return 'Go';
  }
}
