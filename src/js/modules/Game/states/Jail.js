export class Jail {
  constructor() {
    this.name = 'Jail';
  }

  onEnter(stateMachine, gameState) {
    console.log('Jail');
    this.gameState = gameState;
  }

  onExit() {
    console.log('Jail exit');
  }
}
