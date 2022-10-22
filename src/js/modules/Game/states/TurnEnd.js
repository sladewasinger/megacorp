export class TurnEnd {
  constructor() {
    this.name = 'TurnEnd';
  }

  onEnter(stateMachine, gameState) {
    console.log('TurnEnd');
    this.gameState = gameState;

    if (this.gameState.doubleDiceRoll && !this.gameState.currentPlayer.inJail) {
      stateMachine.setState('RollDice', gameState);
      return;
    }
  }

  onExit() {
    console.log('TurnEnd exit');
  }
}
