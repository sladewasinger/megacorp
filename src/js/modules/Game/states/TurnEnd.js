export class TurnEnd {
  constructor() {
    this.name = 'TurnEnd';
  }

  onEnter(stateMachine, gameState) {
    console.log('TurnEnd');
    this.gameState = gameState;
  }

  onExit() {
    console.log('TurnEnd exit');
  }
}
