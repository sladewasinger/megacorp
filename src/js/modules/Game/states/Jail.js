export class Jail {
  constructor() {
    this.name = 'Jail';
  }

  onEnter(stateMachine, gameState) {
    console.log('Jail');
    this.gameState = gameState;

    if (!this.gameState.currentPlayer.inJail) {
      stateMachine.setState('TurnEnd', gameState);
    }

    if (stateMachine.previousState.name == 'Go To Jail') {
      stateMachine.setState('TurnEnd', this.gameState);
      return;
    }

    stateMachine.setState('JailDecision', gameState);
    return;
  }

  onExit() {
    console.log('Jail exit');
  }
}
