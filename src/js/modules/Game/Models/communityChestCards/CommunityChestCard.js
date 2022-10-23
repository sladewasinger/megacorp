export class CommunityChestCard {
  constructor() {
    this.name = 'CommunityChestCard NAME';
    this.msg = 'CommunityChestCard MSG';
    this.type = 'communityChest';
  }

  onDraw(stateMachine, gameState) {
    console.log(`Community Chest: ${this.name} - ${this.msg}`);
    gameState.communityChestCard = {
      name: this.name,
      msg: this.msg,
    };
  }
}
