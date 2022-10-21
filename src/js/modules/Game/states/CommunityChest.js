export class CommunityChest {
  constructor() {
    this.name = 'Community Chest';
  }

  onEnter(stateMachine, gameState) {
    console.log('CommunityChest');
    this.gameState = gameState;

    const card = this.gameState.communityChestDeck.cards.pop();
    this.gameState.communityChestDeck.cards.unshift(card);

    card.onDraw(gameState);

    stateMachine.setState('TurnEnd', this.gameState);
  }

  onExit() {
    console.log('CommunityChest exit');
  }
}