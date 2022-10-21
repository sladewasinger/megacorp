export class TurnEnd {
  constructor() {
    this.name = 'TurnEnd';
  }

  onEnter(gameState) {
    console.log('TurnEnd');
    this.gameState = gameState;
  }

  onExit() {
    console.log('TurnEnd exit');
  }
}
