export class GoToJail {
  constructor() {
    this.name = 'Go To Jail';
  }

  onEnter(stateMachine, gameState) {
    console.log('Go To Jail');
    this.gameState = gameState;
  }

  onExit() {
    console.log('GoToJail exit');
  }
}
