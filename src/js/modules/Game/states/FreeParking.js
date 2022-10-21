export class FreeParking {
  constructor() {
    this.name = 'Free Parking';
  }

  onEnter(stateMachine, gameState) {
    console.log('Free Parking');
    this.gameState = gameState;

    stateMachine.setState('TurnEnd', gameState);
  }

  onExit() {
    console.log('FreeParking exit');
  }
}
