import { CommunityChestCard } from './CommunityChestCard.js';

export class DoctorFees extends CommunityChestCard {
  constructor() {
    super();
    this.name = 'Doctor\'s Fees';
    this.msg = 'Pay $50';
    this.type = 'communityChest';
  }

  onDraw(stateMachine, gameState) {
    super.onDraw(stateMachine, gameState);

    gameState.currentPlayer.money -= 50;
  }
}
