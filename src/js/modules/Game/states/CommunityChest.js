export class CommunityChest {
  constructor() {
    this.name = 'Community Chest';
  }

  onEnter(stateMachine, gameState) {
    console.log('CommunityChest');
    this.gameState = gameState;

    stateMachine.setState('TurnEnd', this.gameState);
  }

  onExit() {
    console.log('CommunityChest exit');
  }
}
