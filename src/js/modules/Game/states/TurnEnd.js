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

    if (this.gameState.players.filter((player) => player.money <= 0).length === this.gameState.players.length - 1 &&
      this.gameState.players.length > 1) {
      this.gameState.gameOver = true;
      this.gameState.winner = this.gameState.players.find((player) => player.money > 0);
    }
  }
}
