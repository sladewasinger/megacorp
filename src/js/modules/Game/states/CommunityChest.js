export class CommunityChest {
  constructor() {
    this.name = 'Community Chest';
    this.type = 'Community Chest';
  }

  onEnter(stateMachine, gameState) {
    console.log('CommunityChest');
    this.gameState = gameState;

    const card = this.gameState.communityChestDeck.cards.pop();
    this.gameState.communityChestDeck.cards.unshift(card);

    const nextState = card.onDraw(stateMachine, gameState) || 'TurnEnd';

    stateMachine.setState(nextState, this.gameState);
  }

  onExit() {
    console.log('CommunityChest exit');
  }
}
