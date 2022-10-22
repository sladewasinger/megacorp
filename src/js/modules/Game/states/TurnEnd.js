export class TurnEnd {
  constructor() {
    this.name = 'TurnEnd';
  }

  onEnter(stateMachine, gameState) {
    console.log('TurnEnd');
    this.gameState = gameState;

    if (this.gameState.doubleDiceRoll) {
      stateMachine.setState('TurnStart', gameState);
      return;
    }
  }

  onExit() {
    console.log('TurnEnd exit');
  }
}
