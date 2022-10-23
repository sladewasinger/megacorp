export class TurnEnd {
  constructor() {
    this.name = 'TurnEnd';
  }

  onEnter(stateMachine, gameState) {
    console.log('TurnEnd');
    this.gameState = gameState;

    for (const player of this.gameState.players) {
      player.hasBid = false;
    }
    this.gameState.auction = null;

    if (this.gameState.doubleDiceRoll && !this.gameState.currentPlayer.inJail) {
      stateMachine.setState('RollDice', gameState);
      return;
    }
  }

  onExit() {
    console.log('TurnEnd exit');
  }
}
