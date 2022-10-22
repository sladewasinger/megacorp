import { CommunityChestCard } from './CommunityChestCard.js';

export class BankErrorInYourFavor extends CommunityChestCard {
  constructor() {
    super();
    this.name = 'Bank Error in Your Favor';
    this.type = 'communityChest';
    this.msg = 'Collect $200';
  }

  onDraw(stateMachine, gameState) {
    super.onDraw(stateMachine, gameState);

    gameState.currentPlayer.money += 200;
  }
}
